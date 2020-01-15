const Board = require('./board.js');
const Player = require('./player.js');

const Game = {
    _joueurs: [],
    _currentPlayer: 0,
    _level: 0,

    _format: {
        0: 3, // 3x3
        1: 5 // 5x5
    },

    init: function(){
        this._board = new Board();
        this._board.generateBoard();
    },

    addPlayer: function(username = 'player'){
        player = new Player();

        player.setUsername(username);

        this._joueurs.push(player);
    },

    // Si player est égal à false, on renvoie la valeur brute de la variables
    // sinon, on renvoie les données du joueurs
    currentPlayer: function(player = false){
        if(player){
            return this._joueurs[this._currentPlayer];
        }

        return this._currentPlayer;
    },

    alternatePlayer: function(){
        this._currentPlayer = (this._currentPlayer) ? 0 : 1;
    },

    getLevel: function(){
        return this._level;
    },

    getFormat: function(val = 0){
        if(this._format[val] != undefined){
            return this._format[val];
        }
        return 0;
    },

    getFormats: function(){
        return this._format;
    }
}

module.exports = Game;
