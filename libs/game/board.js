const Game = require('./game.js');

const Board = class {

    constructor() {
        this._board = [];
    }

    generateBoard(level, format) {

        for(let line = 0; line < format; line ++){
            this._board.push([]);

            for(let column = 0; column < format; column ++){
                this._board[line][column] = null;
            }

        }

    }

    getValue(line, column) {
        return this._board[line][column];
    }

    setValue(line, column, value) {
        this._board[line][column] = value;
        console.log(this._board);
    }

    checkWin() {


    }
}

module.exports = Board;
