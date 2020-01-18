const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const app = new express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const Twig = require("twig");

const uniqid = require('uniqid');

const port = process.env.PORT || 3000;


const indexRoute = require('./libs/controllers/index.js');
const chatRoute = require('./libs/controllers/chat.js');
const gameRoute = require('./libs/controllers/game.js');
const optionsRoute = require('./libs/controllers/options.js');
const userRoute = require('./libs/controllers/user.js');

var eventEmitter = require('events');

// let controller = require('./libs/controller.js');
// controller = new controller();
// controller.init();

const Game = require('./libs/game/game.js');

app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res){
    new gameRoute().select(req, res);
});

app.get('/chat', function(req, res){
    new chatRoute().exec(req, res);
});

app.all('/user/login', function(req, res){
    new userRoute().login(req, res);
});

app.all('/user/logout', function(req, res){
    new userRoute().logout(req, res);
});

app.get('/game/select', function(req, res){
    new gameRoute().select(req, res);
});

app.get('/game/online', function(req, res){
    new gameRoute().execOnline(req, res);
});

app.get('/game/:mode', function(req, res){
    new gameRoute().exec(req, res);
});

app.get('/options', function(req, res){
    new optionsRoute().exec(req, res);
});

// Socket.io
var allPlayers = [];
var searchPlayers = [];
var games = [];
class socket extends eventEmitter {

    constructor(){
        super();

        this.allPlayers = [];
        this.searchPlayers = [];
        this.socket = null;

        this.games = [];

        this.on('search', this.search);
        this.on('leave', this.leave);
        this.on('disconnect', this.disconnect);

        this.on('lobby', () => {});

    }

    async searchInterval()
    {
        var self = this;

        if(this.searchPlayers.length == 2){
            let _uniqid = uniqid();
            games[_uniqid] = new Game();

            var i = 0;
            for( i = 0; i <= self.searchPlayers.length; i ++){
                let joueur = {};

                joueur.searchValue = self.searchPlayers.shift();


                let namespace = null;
                let ns = io.of(namespace || "/");

                let socket = ns.connected[joueur.searchValue];

                games[_uniqid].addPlayer('boussad', socket);

                if(games[_uniqid]._joueurs.length == 2){

                    self.start(games[_uniqid]);

                    //On attends les actions du joueur 1
                    console.log(games[_uniqid]._joueurs[0]);
                    games[_uniqid]._joueurs[0]._socket.on('game action', async function(action){
                        action = n.getGameAction(action, 0);


                        let victoire = await games[_uniqid].getBoard().checkWin();
                        n.sendWinStatus(victoire);

                        console.log(action);
                        //Si il y a une erreur, on envoie le message d'erreur au joueur 1
                        if(action.type == 'erreur'){
                            games[_uniqid]._joueurs[0]._socket.emit('game action', JSON.stringify(action));
                        }

                    });

                    //On attends les actions du joueur 20
                    games[_uniqid]._joueurs[1]._socket.on('game action', async function(action){
                        action = n.getGameAction(action, 1);

                        let victoire = await  games[_uniqid].getBoard().checkWin();
                        n.sendWinStatus(victoire);

                        console.log(action);
                        //Si il y a une erreur, on envoie le message d'erreur au joueur 2
                        if(action.type == 'erreur'){
                            games[_uniqid]._joueurs[1]._socket.emit('game action', JSON.stringify(action));
                        }

                    });

                    //Si joueur 1 quitte le jeu
                    games[_uniqid]._joueurs[0]._socket.on('game leave', function(action){

                        action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
                        games[_uniqid]._joueurs[1]._socket.emit('game action', JSON.stringify(action));

                        delete games[_uniqid];
                        delete games[_uniqid]._joueurs[0];
                        delete games[_uniqid]._joueurs[1];

                    });

                    //Si joueur 2 quitte le jeu
                    games[_uniqid]._joueurs[1]._socket.on('game leave', function(action){

                        action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 2 à quitter la partie.`};
                        games[_uniqid]._joueurs[0]._socket.emit('game action', JSON.stringify(action));

                        delete games[_uniqid];
                        delete games[_uniqid]._joueurs[0];
                        delete games[_uniqid]._joueurs[1];

                    });
                }

            }

        }


    }

    search()
    {

        this.searchPlayers.push(this.socket.id);

        console.log(this.searchPlayers);

    }

    leave()
    {

        let socket = this.socket;

        delete this.allPlayers[socket.id];

        console.log('suppression'+socket.id);
        console.log(this.allPlayers);

        this.searchPlayers = this.searchPlayers.filter(function (el) {
          return el != socket.id;
        });

        console.log('Recherche de partie quitter');
        console.log(this.allPlayers);

    }

    disconnect()
    {

        let socket = this.socket;

        delete allPlayers[socket.id];

        this.searchPlayers = this.searchPlayers.filter(function (el) {
          return el != socket.id;
        });

    }

    log(){
        console.log('connexion');
        let self = this;

        io.on('connection', function(socket){
            self.socket = socket;

            //On ajoute et initie le joueur
            self.allPlayers[socket.id];

            self.allPlayers[socket.id] = {};
            self.allPlayers[socket.id].username = 'boussad';

            socket.on('game search', () => {

                self.emit('search');

            });

            socket.on('game leavesearch', function(action){

                self.emit('leave');

            });

            socket.on('chat message', function(msg){
                io.emit('chat message', allPlayers[socket.id].username+ ' '+msg);
                // io.sockets.socket(socketId).emit(msg);
            });

            socket.on('chat username', function(msg){
                allPlayers[socket.id].username = msg;
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
        game._joueurs[0].emit('game action', JSON.stringify(game.getInteractive().getAction()));

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



    getGameAction(action, player){

        action = JSON.parse(action);
        games[_uniqid].getInteractive().ClickOnCase(action, player);

        action = games[_uniqid].getInteractive().getAction();

        // S'il n'y a pas d'erreur on envoie les informations aux joueurs
        if(action.type != 'erreur'){
            socketPlayer1.emit('game action', JSON.stringify(action));
            socketPlayer2.emit('game action', JSON.stringify(action));
        }

        return action;
    }


    sendWinStatus(victoire){

        let actionWin = {action: 'leaveGame', win: true, type: 'valide', message: `Victoire !`};
        let actionLoose = {action: 'leaveGame', loose: true, type: 'erreur', message: `Vous avez perdu ! Rententez votre chance !`};

        if(victoire == 0){
            socketPlayer1.emit('game action', JSON.stringify(actionWin));
            socketPlayer2.emit('game action', JSON.stringify(actionLoose));
        }
        else if(victoire == 1){
            socketPlayer1.emit('game action', JSON.stringify(actionLoose));
            socketPlayer2.emit('game action', JSON.stringify(actionWin));
        }

        //On supprime le Board
        // if(victoire != undefined || victoire != null){
        //     delete games[_uniqid];
        //     delete socketPlayer1;
        //     delete socketPlayer2;
        // }
    }
}

class morpion extends socket {

    constructor(){
        super();
    }

}

var n = new morpion();

n.log();

setInterval( function() {

    n.searchInterval();

    // if(searchPlayers.length == 2){
    //
    //
    //     } else {
    //         if(socketPlayer1) {
    //             socketPlayer1.emit("game clear", 1);
    //             socketPlayer1.emit("game search", 1);
    //         }
    //         if(socketPlayer2) {
    //             socketPlayer2.emit("game clear", 1);
    //             socketPlayer2.emit("game search", 1);
    //         }
    //     }
}, 4000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
