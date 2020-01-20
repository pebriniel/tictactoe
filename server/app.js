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
var allPlayers = [];
var searchPlayers = [];
var games = [];

io.use(socketCookies);

io.on('connection', function(socket){
    //On ajoute et initie le joueur
    allPlayers[socket.id];

    allPlayers[socket.id] = {};
    allPlayers[socket.id].username = 'boussad';
    allPlayers[socket.id].cookie = socket.request.cookies['userSession'];

    socket.on('game search', async function(action){
        // Nous vérifions que l'utilisateur est bien connecté...
        try{

            console.log(allPlayers[socket.id].cookie);
            let utilisateur = await controller.user.isConnected(allPlayers[socket.id].cookie);

            // S'il est bien connecté, on lance la recherche de partie
            if(utilisateur){

                searchPlayers.push({
                    socket: socket.id,
                    user: utilisateur
                });
                console.log('Recherche de partie');

            }

        }
        catch{

            console.log('stop try ');

            delete allPlayers[socket.id];

            action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};
            socket.emit('game action', JSON.stringify(action));

            searchPlayers = searchPlayers.filter(function (el) {
              return el.socket != socket.id;
            });
        }

    });

    socket.on('game leavesearch', function(action){
        // delete allPlayers[socket.id];

        searchPlayers = searchPlayers.filter(function (el) {
          return el.socket != socket.id;
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
        games[_uniqid].addPlayer(joueur1.user);
        games[_uniqid].addPlayer(joueur2.user);
        games[_uniqid].init();

        let namespace = null;
        let ns = io.of(namespace || "/");

        let socketPlayer1 = ns.connected[joueur1.socket];
        let socketPlayer2 = ns.connected[joueur2.socket];

        if (socketPlayer1 && socketPlayer2) {
            socketPlayer1.emit("game find", 1);
            socketPlayer2.emit("game find", 1);

            //Message d'accueil
            games[_uniqid].getInteractive().setActionMessage('valide', `Vous commencez !`);
            socketPlayer1.emit('game action', JSON.stringify(games[_uniqid].getInteractive().getAction()));

            games[_uniqid].getInteractive().setActionMessage('valide', `Votre adversaire commence ! `);
            socketPlayer2.emit('game action', JSON.stringify(games[_uniqid].getInteractive().getAction()));

            //On attends les messages du joueur 1
            socketPlayer1.on('game message', function(msg){
                games[_uniqid].setReplayValue(msg);

                socketPlayer2.emit('game message', msg);
                socketPlayer1.emit('game message', msg);
            });

            //On attends les messages du joueur 2
            socketPlayer2.on('game message', function(msg){
                games[_uniqid].setReplayValue(msg);

                socketPlayer1.emit('game message', msg);
                socketPlayer2.emit('game message', msg);
            });

            function getGameAction(action, player){

                action = JSON.parse(action);
                games[_uniqid].getInteractive().ClickOnCase(action, player);

                action = games[_uniqid].getInteractive().getAction();

                // S'il n'y a pas d'erreur on envoie les informations aux joueurs
                if(action.type != 'erreur'){
                    games[_uniqid].setReplayValue(action);
                    games[_uniqid].getBoard().addAction();

                    socketPlayer1.emit('game action', JSON.stringify(action));
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }

                return action;
            }

            function sendWinStatus(victoire){

                let actionWin = {action: 'leaveGame', win: true, type: 'valide', message: `Victoire !`};
                let actionLoose = {action: 'leaveGame', loose: true, type: 'erreur', message: `Vous avez perdu ! Rententez votre chance !`};
                let actionDraw = {action: 'leaveGame', draw: true, type: 'valide', message: `Il n'y a plus d'action possible, vous êtes à égalité ! Rententez votre chance !`};

                if(victoire == 0) {

                    games[_uniqid].getReplayModel().setWinA(true);

                    games[_uniqid].setReplayValue(actionWin);
                    socketPlayer1.emit('game action', JSON.stringify(actionWin));

                    games[_uniqid].setReplayValue(actionLoose);
                    socketPlayer2.emit('game action', JSON.stringify(actionLoose));

                }
                else if(victoire == 1) {

                    games[_uniqid].getReplayModel().setWinB(true);

                    games[_uniqid].setReplayValue(actionLoose);
                    socketPlayer1.emit('game action', JSON.stringify(actionLoose));

                    games[_uniqid].setReplayValue(actionWin);
                    socketPlayer2.emit('game action', JSON.stringify(actionWin));

                }
                // il y a une égalité !
                else if(victoire == 2) {

                    games[_uniqid].setReplayValue(actionDraw);

                    socketPlayer1.emit('game action', JSON.stringify(actionDraw));
                    socketPlayer2.emit('game action', JSON.stringify(actionDraw));

                }

                //On supprime le Board
                if(victoire != undefined || victoire != null){

                    games[_uniqid].getReplayModel().save(games[_uniqid].getReplayValue());

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
                    games[_uniqid].setReplayValue(action);
                    socketPlayer1.emit('game action', JSON.stringify(action));
                }

            });

            //On attends les actions du joueur 2
            socketPlayer2.on('game action', async function(action){
                action = getGameAction(action, 1);

                let victoire = await  games[_uniqid].getBoard().checkWin();
                sendWinStatus(victoire);

                console.log(action);
                //Si il y a une erreur, on envoie le message d'erreur au joueur 2
                if(action.type == 'erreur'){
                    games[_uniqid].setReplayValue(action);
                    socketPlayer2.emit('game action', JSON.stringify(action));
                }

                // sendWinStatus(victoire);
            });

            //Si joueur 1 quitte le jeu
            socketPlayer1.on('game leave', function(action){

                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 1 à quitter la partie.`};

                if(games[_uniqid] != undefined){
                    games[_uniqid].setReplayValue(action);
                }

                socketPlayer2.emit('game action', JSON.stringify(action));

                if(games[_uniqid] != undefined){
                    games[_uniqid].getReplayModel().save(games[_uniqid].getReplayValue());
                }

                delete games[_uniqid];
                delete socketPlayer1;
                delete socketPlayer2;

            });

            //Si joueur 2 quitte le jeu
            socketPlayer2.on('game leave', function(action){

                action = {action: 'leaveGame', win: 1, type: 'erreur', message: `Le joueur 2 à quitter la partie.`};
                if(games[_uniqid] != undefined){
                    games[_uniqid].setReplayValue(action);
                }


                socketPlayer1.emit('game action', JSON.stringify(action));

                if(games[_uniqid] != undefined){
                    games[_uniqid].getReplayModel().save(games[_uniqid].getReplayValue());
                }

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
