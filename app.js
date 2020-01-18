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
io.on('connection', function(socket){
    //On ajoute et initie le joueur
    allPlayers[socket.id];

    allPlayers[socket.id] = {};
    allPlayers[socket.id].username = 'boussad';

    socket.on('game search', async function(action){
        // Nous vérifions que l'utilisateur est bien connecté...
        try{

            let status = await controller.user.isConnected('evs2728ik5ix1qdi');

            // S'il est bien connecté, on lance la recherche de partie
            if(status){

                searchPlayers.push(socket.id);
                console.log('Recherche de partie');
                console.log(searchPlayers);
            }

        }
        catch{

            delete allPlayers[socket.id];

            action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
            socket.emit('game action', JSON.stringify(action));

            searchPlayers = searchPlayers.filter(function (el) {
              return el != socket.id;
            });
        }

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

        let namespace = null;
        let ns = io.of(namespace || "/");

        let socketPlayer1 = ns.connected[joueur1];
        let socketPlayer2 = ns.connected[joueur2];

        if (socketPlayer1 && socketPlayer2) {
            socketPlayer1.emit("game find", 1);
            socketPlayer2.emit("game find", 1);

            //Message d'accueil
            games[_uniqid].getInteractive().setActionMessage('valide', `Vous commencez !`);
            socketPlayer1.emit('game action', JSON.stringify(games[_uniqid].getInteractive().getAction()));

            games[_uniqid].getInteractive().setActionMessage('valide', `Vous êtes le deuxième joueur ! `);
            socketPlayer2.emit('game action', JSON.stringify(games[_uniqid].getInteractive().getAction()));

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
                if(action.type != 'erreur'){
                    socketPlayer1.emit('game action', JSON.stringify(action));
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }

                return action;
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

                //On supprime le Board
                if(victoire != undefined || victoire != null){
                    delete games[_uniqid];
                    delete socketPlayer1;
                    delete socketPlayer2;
                }
            }

            //On attends les actions du joueur 1
            socketPlayer1.on('game action', async function(action){
                action = getGameAction(action, 0);


                let victoire = await games[_uniqid].getBoard().checkWin();
                sendWinStatus(victoire);

                console.log(action);
                //Si il y a une erreur, on envoie le message d'erreur au joueur 1
                if(action.type == 'erreur'){
                    socketPlayer1.emit('game action', JSON.stringify(action));
                }

            });

            //On attends les actions du joueur 20
            socketPlayer2.on('game action', async function(action){
                action = getGameAction(action, 1);

                let victoire = await  games[_uniqid].getBoard().checkWin();
                sendWinStatus(victoire);

                console.log(action);
                //Si il y a une erreur, on envoie le message d'erreur au joueur 2
                if(action.type == 'erreur'){
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }

                // sendWinStatus(victoire);
            });

            //Si joueur 1 quitte le jeu
            socketPlayer1.on('game leave', function(action){

                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
                socketPlayer2.emit('game action', JSON.stringify(action));

                delete games[_uniqid];
                delete socketPlayer1;
                delete socketPlayer2;

            });

            //Si joueur 2 quitte le jeu
            socketPlayer2.on('game leave', function(action){

                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 2 à quitter la partie.`};
                socketPlayer1.emit('game action', JSON.stringify(action));

                delete games[_uniqid];
                delete socketPlayer1;
                delete socketPlayer2;

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
