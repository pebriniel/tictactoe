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

app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res){
    new indexRoute().exec(req, res);
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

var allPlayers = [];
var searchPlayers = [];
var games = [];
io.on('connection', function(socket){
    //On ajoute et initie le joueur
    allPlayers[socket.id];

    allPlayers[socket.id] = {};
    allPlayers[socket.id].username = 'boussad';

    socket.on('game action', function(action){
        console.log(action);
        // io.emit('game action', allPlayers[socket.id].username+ ' '+msg);
    });

    socket.on('game search', function(action){
        searchPlayers.push(socket.id);
        console.log('Recherche de partie');
        console.log(searchPlayers);
    });

    socket.on('game leavesearch', function(action){
        let i = searchPlayers.indexOf(socket.id);
        delete searchPlayers[i];
        console.log('Recherche de partie quitter');
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
      delete searchPlayers[socket.id];

   });
});

setInterval( function() {

    if(searchPlayers.length == 2){
        let joueur1 = searchPlayers.shift();
        let joueur2 = searchPlayers.shift();

        let _uniqid = uniqid();
        games[_uniqid] = {};
        games[_uniqid].players = {};
        games[_uniqid].players[0] = joueur1;
        games[_uniqid].players[1] = joueur2;

        let namespace = null;
        let ns = io.of(namespace || "/");

        let socketPlayer1 = ns.connected[joueur1];
        let socketPlayer2 = ns.connected[joueur2];

        if (socketPlayer1 && socketPlayer2) {
            socketPlayer1.emit("game find", 1);
            socketPlayer2.emit("game find", 1);
        } else {
            if(socketPlayer1) {
                socketPlayer1.emit("game search", 1);
            }
            if(socketPlayer2) {
                socketPlayer2.emit("game search", 1);
            }
        }

    }
}, 4000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
