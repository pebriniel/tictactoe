const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const session = require('express-session');
const uniqid = require('uniqid');

const app = new express();

const http = require('http').Server(app);
const io = require('socket.io')(http);
const Twig = require("twig");

const port = process.env.PORT || 3000;


const socketCookies = require('./libs/middleware/socketCookies.js');

const indexRoute = require('./libs/controllers/index.js');
const chatRoute = require('./libs/controllers/chat.js');
const gameRoute = require('./libs/controllers/game.js');
const optionsRoute = require('./libs/controllers/options.js');
const userRoute = require('./libs/controllers/user.js');

let controller = require('./libs/controller.js');
controller = new controller();

const Game = require('./libs/game/game.js');

const registerValidationRules = require('./libs/forms/validators/register.js')

app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

app.use(express.json());

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static(__dirname + '/dist'));

app.get('/', function(req, res){
    new gameRoute(req, res).select();
});

app.get('/chat', function(req, res){
    new chatRoute(req, res).exec();
});

app.all('/user/login', function(req, res){
    new userRoute(req, res).login();
});

app.post('/user/register', registerValidationRules(), function(req, res){
    new userRoute(req, res).registerPost();
});

app.all('/user/logout', function(req, res){
    new userRoute(req, res).logout();
});

app.all('/user/replays', function(req, res){
    new userRoute(req, res).replay();
});

app.get('/game/replay/:id', function(req, res){
    new gameRoute(req, res).replay();
});

app.get('/game/select', function(req, res){
    new gameRoute(req, res).select();
});

app.get('/game/online', function(req, res){
    new gameRoute(req, res).execOnline();
});

app.get('/game/:mode', function(req, res){
    new gameRoute(req, res).exec();
});

app.get('/options', function(req, res){
    new optionsRoute(req, res).exec();
});


// Socket.io
var searchPlayers = [];
var games = [];

io.use(socketCookies);

function searchVersus()
{

    // console.log(searchPlayers);

    if(searchPlayers.length == 2){
        let joueur1 = searchPlayers.shift();
        let joueur2 = searchPlayers.shift();

        let _uniqid = uniqid();

        games[_uniqid] = new Game();
        games[_uniqid].addPlayer(joueur1.user);
        games[_uniqid].addPlayer(joueur2.user);
        games[_uniqid].init();

        let namespace = null;
        let ns = io.of(namespace || "/");

        if (joueur1.socket && joueur2.socket) {

            joueur1.socket.board = _uniqid;
            joueur2.socket.board = _uniqid;

            joueur1.socket.joueur = 0;
            joueur2.socket.joueur = 1;

            joueur1.socket.join(_uniqid);
            joueur2.socket.join(_uniqid);

            joueur1.socket.emit("game find", 1);
            joueur2.socket.emit("game find", 1);
        }
    }
}

function getGameAction(action, board, player){

    action = JSON.parse(action);

    games[board].getInteractive().ClickOnCase(action, player);

    action = games[board].getInteractive().getAction();

    // S'il n'y a pas d'erreur on envoie les informations aux joueurs
    if(action.type != 'erreur'){
        games[board].setReplayValue(action);
        games[board].getBoard().addAction();

        io.sockets.in(board).emit('game action', JSON.stringify(action));
    }

    return action;
}

function sendWinStatus(victoire, board, socketId){

    let actionWin = {action: 'leaveGame', win: true, type: 'valide', message: `Victoire !`};
    let actionLoose = {action: 'leaveGame', loose: true, type: 'erreur', message: `Vous avez perdu ! Rententez votre chance !`};
    let actionDraw = {action: 'leaveGame', draw: true, type: 'valide', message: `Il n'y a plus d'action possible, vous êtes à égalité ! Rententez votre chance !`};

    if(victoire == 0) {

        games[board].getReplayModel().setWinA(true);

        games[board].setReplayValue(actionLoose);
        io.sockets.to(board).emit('game action', JSON.stringify(actionLoose));

        games[board].setReplayValue(actionWin);
        io.sockets.to(`${socketId}`).emit('game action', JSON.stringify(actionWin));


    }
    else if(victoire == 1) {

        games[board].getReplayModel().setWinB(true);

        games[board].setReplayValue(actionLoose);
        io.sockets.to(board).emit('game action', JSON.stringify(actionLoose));

        games[board].setReplayValue(actionWin);
        io.sockets.to(`${socketId}`).emit('game action', JSON.stringify(actionWin));

    }
    // il y a une égalité !
    else if(victoire == 2) {

        games[board].setReplayValue(actionDraw);

        io.sockets.in(board).emit('game action', JSON.stringify(actionDraw));

    }

    //On supprime le Board
    if(victoire != undefined || victoire != null){

        games[board].getReplayModel().save(games[board].getReplayValue());

        delete games[board];
    }
}

io.on('connection', function(socket){

    socket.on('game search', async function(action){
        // Nous vérifions que l'utilisateur est bien connecté...
        try{

            let utilisateur = await controller.user.isConnected(socket.request.cookies['userSession']);

            // S'il est bien connecté, on lance la recherche de partie
            if(utilisateur){

                if(socket.user == undefined){
                    socket.user = utilisateur;
                }

                searchPlayers.push({
                    socket: socket,
                    user: utilisateur
                });

                searchVersus();

            }

        }
        catch{

            action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
            socket.emit('game action', JSON.stringify(action));

            searchPlayers = searchPlayers.filter(function (el) {
              return el.socket != socket;
            });
        }

    });

    socket.on('game leavesearch', function(action){
        // delete allPlayers[socket];

        console.log('game leavesearch');

        searchPlayers = searchPlayers.filter(function (el) {
          return el.socket != socket;
        });

    });

    socket.on('chat message', function(msg){

        io.emit('chat message', socket.username+ ' '+msg);

    });

    socket.on('chat username', function(msg){
        socket.username = msg;
    });

    //On nsupprime le joueur du tableau
    socket.on('disconnect', function() {

      searchPlayers = searchPlayers.filter(function (el) {
        return el != socket;
      });
   });

   socket.on('game action', async function(action){
       action = getGameAction(action, socket.board, socket.joueur);


       let victoire = await games[socket.board].getBoard().checkWin();
       sendWinStatus(victoire, socket.board, socket.id);

       //Si il y a une erreur, on envoie le message d'erreur au joueur 1
       if(action.type == 'erreur'){
           games[socket.board].setReplayValue(action);
           io.sockets.in(socket.board).emit('game action', JSON.stringify(action));
       }
   });

   //On attends les messages du joueur 1
   socket.on('game message', function(msg){
       games[socket.board].setReplayValue({joueur: socket.joueur, message: msg});

       io.sockets.in(socket.board).emit('game message', msg);

   });

   //Si joueur 1 quitte le jeu
   socket.on('game leave', function(action){

       let joueur = socket.joueur ++;

       action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur ${joueur} à quitter la partie.`};

       if(games[socket.board] != undefined){
           games[socket.board].setReplayValue(action);
       }

       io.sockets.to(socket.board).emit('game action', JSON.stringify(action));

       if(games[socket.board] != undefined){
           games[socket.board].getReplayModel().save(games[socket.board].getReplayValue());
       }

       delete games[socket.board];

   });

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});
