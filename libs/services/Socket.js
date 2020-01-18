const eventEmitter = require('events');
const uniqid = require('uniqid');
const Game = require('../game/game.js');

var allPlayers = [];
var searchPlayers = [];
var games = [];

class Socket extends eventEmitter {

    constructor(getIOInstance){
        super();

        this.io = getIOInstance;

        this.allPlayers = [];
        this.searchPlayers = [];
        this.socket = null;

        this.games = [];

        this.GameObject = new Game();

        this.on('search', this.search);
        this.on('disconnect', this.disconnect);

        this.on('gameAction', this.gameAction);
        this.on('gameLeave', this.gameLeave);

        this.on('lobby', () => {});

    }

    async searchInterval()
    {
        var self = this;

        // Si nous avons le bon nombre de joueur sur le serveur.
        if(this.searchPlayers.length == this.GameObject.getMaxPlayer()){
            let _uniqid = uniqid();
            games[_uniqid] = new Game();

            var i = 0;
            for( i = 0; i < this.GameObject.getMaxPlayer(); i ++){

                let joueur = self.searchPlayers.shift();

                let namespace = null;
                let ns = this.io.of(namespace || "/");

                let socket = ns.connected[joueur];

                games[_uniqid].addPlayer('boussad', socket);

                console.log(_uniqid);

                let start = true;
                if(!socket){
                    start = false;
                }

                games[_uniqid].init();

                // Si notre board contient bien le bon nombre de joueurs nécessaires à la partie
                if(start && games[_uniqid]._joueurs.length == this.GameObject.getMaxPlayer()){

                    console.log('connexion');

                    self.start(games[_uniqid]);

                    for( let currentPlayer = 0; currentPlayer < games[_uniqid]._joueurs.length; currentPlayer ++){

                        // Les actions des joueurs
                        games[_uniqid]._joueurs[currentPlayer]._socket.on('game action', (action) => {
                            self.emit('gameAction', games[_uniqid], action, currentPlayer, _uniqid);
                        });

                        //En cas de déconnexion
                        games[_uniqid]._joueurs[currentPlayer]._socket.on('game leave', (action) => {
                            self.emit('gameLeave', games[_uniqid], action, currentPlayer, uniqid);
                        });
                    }

                }
                else if(!start){
                    games[_uniqid].getPlayers().forEach( player => {
                        if(player.getSocket()){
                            player.getSocket().emit("game clear", 1);
                            player.getSocket().emit("game search", 1);
                        }
                    })

                    game = null;
                    delete games[_uniqid];

                    break;
                }

            }

        }

    }

    search()
    {

        this.searchPlayers.push(this.socket.id);

    }

    disconnect()
    {

        let socket = this.socket;

        delete this.allPlayers[socket.id];

        this.searchPlayers = this.searchPlayers.filter(function (el) {
          return el != socket.id;
        });

    }

    connection(){

        let self = this;

        this.io.on('connection', function(socket){
            self.socket = socket;

            //On ajoute et initie le joueur
            self.allPlayers[socket.id];

            self.allPlayers[socket.id] = {};
            self.allPlayers[socket.id].username = 'boussad';

            console.log(self.allPlayers);
            console.log(games);

            socket.once('disconnect', function () {
                delete self.allPlayers[socket.id];
                console.log(self.allPlayers);
            });

            socket.on('game search', () => {

                self.emit('search');

            });

            socket.on('game leavesearch', function(action){

                self.emit('disconnect');

            });

            socket.on('chat message', function(msg){
                this.io.emit('chat message', self.allPlayers[socket.id].username+ ' '+msg);
                // this.io.sockets.socket(socketId).emit(msg);
            });

            socket.on('chat username', function(msg){
                self.allPlayers[socket.id].username = msg;
            });

            //On supprime le joueur du tableau
            socket.on('disconnect', function() {

                self.emit('disconnect');

           });
        });
    }



    start(game)
    {

        game._joueurs[0]._socket.emit("game find", 1);
        game._joueurs[1]._socket.emit("game find", 1);

        //Message d'accueil
        game.getInteractive().setActionMessage('valide', `Vous commencez !`);
        game._joueurs[0]._socket.emit('game action', JSON.stringify(game.getInteractive().getAction()));

        game.getInteractive().setActionMessage('valide', `Vous êtes le deuxième joueur ! `);
        game._joueurs[1]._socket.emit('game action', JSON.stringify(game.getInteractive().getAction()));

        //On attends les messages du joueur 1
        game._joueurs[0]._socket.on('game message', function(msg){
            game._joueurs[1]._socket.emit('game message', msg);
            game._joueurs[0]._socket.emit('game message', msg);
        });

        //On attends les messages du joueur 2
        game._joueurs[1]._socket.on('game message', function(msg){
            game._joueurs[0]._socket.emit('game message', msg);
            game._joueurs[1]._socket.emit('game message', msg);
        });
    }



    async getGameAction(game, action, player){

        action = JSON.parse(action);

        game.getInteractive().ClickOnCase(action, player);

        action = game.getInteractive().getAction();

        // S'il n'y a pas d'erreur on envoie les informations aux joueurs
        if(action.type != 'erreur'){
            game._joueurs[0]._socket.emit('game action', JSON.stringify(action));
            game._joueurs[1]._socket.emit('game action', JSON.stringify(action));
        }

        return action;


    }

    gameLeave(game, action, selectPlayer, uniqid)
    {
        if(game._joueurs){

            const listPlayers = game._joueurs;
            delete listPlayers[selectPlayer];

            action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};

            listPlayers.forEach( item  => {
                if(item._socket){
                    item._socket.emit('game action', JSON.stringify(action));
                }
            } );
            
        }

        // delete game;
        delete games[uniqid];
    }

    async gameAction(game, action, selectPlayer, _uniqid)
    {
        const listPlayers = game.getPlayers();

        try{

            action = await this.getGameAction(game, action, selectPlayer);
            let victoire = await game.getBoard().checkWin();

            this.sendWinStatus(game, victoire, _uniqid);

            //Si il y a une erreur, on envoie le message d'erreur au joueur 1
            if(action.type == 'erreur'){
                listPlayers[selectPlayer]._socket.emit('game action', JSON.stringify(action));
            }
        }
        catch
        {

        }
    }


    sendWinStatus(game, victoire, _uniqid)
    {

        let actionWin = {action: 'leaveGame', win: true, type: 'valide', message: `Victoire !`};
        let actionLoose = {action: 'leaveGame', loose: true, type: 'erreur', message: `Vous avez perdu ! Rententez votre chance !`};

        if(victoire == 0){
            game._joueurs[0]._socket.emit('game action', JSON.stringify(actionWin));
            game._joueurs[1]._socket.emit('game action', JSON.stringify(actionLoose));
        }
        else if(victoire == 1){
            game._joueurs[0]._socket.emit('game action', JSON.stringify(actionLoose));
            game._joueurs[1]._socket.emit('game action', JSON.stringify(actionWin));
        }

        //On supprime le Board
        console.log('victoire'+victoire);
        if(victoire != undefined || victoire != null){

            delete game._joueurs[1]._socket;
            delete game._joueurs[1]._socket;

            game = null;
            delete games[_uniqid];

        }
    }
}

module.exports = function(getIOInstance){
    return new Socket(getIOInstance);
};
