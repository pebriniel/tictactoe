var express = require('express');

const app = new express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
const Twig = require("twig");

var port = process.env.PORT || 3000;


const indexRoute = require('./libs/controllers/index.js');
const chatRoute = require('./libs/controllers/chat.js');
const gameRoute = require('./libs/controllers/game.js');

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

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
