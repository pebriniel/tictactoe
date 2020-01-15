const express = require('express');

const app = new express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const Twig = require("twig");

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
        allPlayers[socket.id];
        console.log(allPlayers);
    });

    socket.on('game leavesearch', function(action){
        delete searchPlayers[socket.id];
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', allPlayers[socket.id].username+ ' '+msg);
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

http.listen(port, function(){
  console.log('listening on *:' + port);
});
