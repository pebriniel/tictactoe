const Board = require('./board.js');
const Player = require('./player.js');
const Interactive = require('./interactive.js');

const Game = class {

    constructor() {
        this._joueurs = [];
        this._currentPlayer = 0;
        this._level = 0;

        this._format = {
            0: 3, // 3x3
            1: 5 // 5x5
        };
    }

    init(){
        this._board = new Board();
        this._board.generateBoard(this.getLevel(), this.getFormat(this.getLevel()));

        this._interactive = new Interactive();
        this._interactive.init(this);
    }

    addPlayer(username = 'player', socket = null){
        const player = new Player();

        player.setUsername(username);
        player.setSocket(socket);

        this._joueurs.push(player);
    }

    // Si player est égal à false, on renvoie la valeur brute de la variables
    // sinon, on renvoie les données du joueurs
    currentPlayer(player = false){
        if(player){
            return this._joueurs[this._currentPlayer];
        }

        return this._currentPlayer;
    }

    alternatePlayer(){
        this._currentPlayer = (this._currentPlayer) ? 0 : 1;
    }

    getLevel(){
        return this._level;
    }

    getBoard(){
        return this._board;
    }

    getFormat(val = 0){
        if(this._format[val] != undefined){
            return this._format[val];
        }
        return 0;
    }

    getFormats(){
        return this._format;
    }

    getInteractive(){
        return this._interactive;
    }
}

module.exports = Game;
