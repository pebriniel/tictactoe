const express = require('express');

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

const Game = require('./libs/game/game.js');

app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res){
    // new indexRoute().exec(req, res);
    new gameRoute().select(req, res);
});

app.get('/chat', function(req, res){
    new chatRoute().exec(req, res);
});

app.get('/game/select', function(req, res){
    new gameRoute().select(req, res);
});

app.get('/game', function(req, res){
    new gameRoute().exec(req, res);
});

app.get('/game/online', function(req, res){
    new gameRoute().execOnline(req, res);
});

app.get('/options', function(req, res){
    new optionsRoute().exec(req, res);
});


// Socket.io

var allPlayers = [];
var searchPlayers = [];
var games = [];
io.on('connection', function(socket){
    //On ajoute et initie le joueur
    allPlayers[socket.id];

    allPlayers[socket.id] = {};
    allPlayers[socket.id].username = 'boussad';

    socket.on('game search', function(action){
        searchPlayers.push(socket.id);
        console.log('Recherche de partie');
        console.log(searchPlayers);
    });

    socket.on('game leavesearch', function(action){
        delete allPlayers[socket.id];

        searchPlayers = searchPlayers.filter(function (el) {
          return el != socket.id;
        });

        console.log('Recherche de partie quitter');
        console.log(allPlayers);
        console.log(searchPlayers);
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', allPlayers[socket.id].username+ ' '+msg);
        // io.sockets.socket(socketId).emit(msg);
    });

    socket.on('chat username', function(msg){
        allPlayers[socket.id].username = msg;
    });

    //On nsupprime le joueur du tableau
    socket.on('disconnect', function() {
      delete allPlayers[socket.id];

      searchPlayers = searchPlayers.filter(function (el) {
        return el != socket.id;
      });

   });
});

setInterval( function() {

    if(searchPlayers.length == 2){
        let joueur1 = searchPlayers.shift();
        let joueur2 = searchPlayers.shift();

        let _uniqid = uniqid();
        games[_uniqid] = new Game();
        games[_uniqid].addPlayer(joueur1);
        games[_uniqid].addPlayer(joueur2);
        games[_uniqid].init();

        console.log(games);

        let namespace = null;
        let ns = io.of(namespace || "/");

        let socketPlayer1 = ns.connected[joueur1];
        let socketPlayer2 = ns.connected[joueur2];

        if (socketPlayer1 && socketPlayer2) {
            socketPlayer1.emit("game find", 1);
            socketPlayer2.emit("game find", 1);

            //On attends les messages du joueur 1
            socketPlayer1.on('game message', function(msg){
                socketPlayer2.emit('game message', msg);
                socketPlayer1.emit('game message', msg);
            });

            //On attends les messages du joueur 2
            socketPlayer2.on('game message', function(msg){
                socketPlayer1.emit('game message', msg);
                socketPlayer2.emit('game message', msg);
            });

            function getGameAction(action, player){

                action = JSON.parse(action);
                games[_uniqid].getInteractive().ClickOnCase(action, player);

                action = games[_uniqid].getInteractive().getAction();

                // S'il n'y a pas d'erreur on envoie les informations aux joueurs
                if(action.erreur == undefined){
                    socketPlayer1.emit('game action', JSON.stringify(action));
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }
            }

            function sendWinStatus(victoire){

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

                console.log('sendWinStatus'+victoire);
                if(victoire){
                    console.log('delete de la session');
                    console.log(_uniqid);
                    delete games[_uniqid];
                    delete socketPlayer1;
                    delete socketPlayer2;
                }
            }

            //On attends les actions du joueur 1
            socketPlayer1.on('game action', async function(action){
                getGameAction(action, 0);


                let victoire = await games[_uniqid].getBoard().checkWin();

                //Si il y a une erreur, on envoie le message d'erreur au joueur 1
                if(action.erreur != undefined){
                    socketPlayer1.emit('game action', JSON.stringify(action));
                }

                sendWinStatus(victoire);
            });

            //On attends les actions du joueur 20
            socketPlayer2.on('game action', async function(action){
                getGameAction(action, 1);

                let victoire = await  games[_uniqid].getBoard().checkWin();

                //Si il y a une erreur, on envoie le message d'erreur au joueur 2
                if(action.erreur != undefined){
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }

                sendWinStatus(victoire);
            });

            //Si joueur 1 quitte le jeu
            socketPlayer1.on('game leave', function(action){
                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
                socketPlayer2.emit('game action', JSON.stringify(action));

                delete games[_uniqid];
                delete socketPlayer1;
                delete socketPlayer2;

                console.log(games);
            });

            //Si joueur 2 quitte le jeu
            socketPlayer2.on('game leave', function(action){
                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 2 à quitter la partie.`};
                socketPlayer1.emit('game action', JSON.stringify(action));

                delete games[_uniqid];
                delete socketPlayer1;
                delete socketPlayer2;

                console.log(games);
            });
        } else {
            if(socketPlayer1) {
                socketPlayer1.emit("game clear", 1);
                socketPlayer1.emit("game search", 1);
            }
            if(socketPlayer2) {
                socketPlayer2.emit("game clear", 1);
                socketPlayer2.emit("game search", 1);
            }
        }

    }
}, 4000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
