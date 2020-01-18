const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const app = new express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const Twig = require("twig");

const port = process.env.PORT || 3000;


const indexRoute = require('./libs/controllers/index.js');
const chatRoute = require('./libs/controllers/chat.js');
const gameRoute = require('./libs/controllers/game.js');
const optionsRoute = require('./libs/controllers/options.js');
const userRoute = require('./libs/controllers/user.js');

// let controller = require('./libs/controller.js');
// controller = new controller();
// controller.init();

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
const socket = require("./libs/services/Socket.js")(io);

socket.connection();

setInterval( async function() {

    await socket.searchInterval();

}, 4000);

http.listen(port, function(){
  console.log('listening on *:' + port);
});
