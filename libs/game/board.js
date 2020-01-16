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
    }

    async checkWinElementDiagonal(inverse = false){
        let currentPlayer = null;
        let victoire = 0;
        let column, returnPlayer;

        for(let line = 0; line < this._board.length; line ++){

            column = line;
            if(inverse){
                column = (this._board.length - 1) - line;
            }

            returnPlayer = this._board[line][column];

            if(returnPlayer != currentPlayer){
                victoire = 1;
                currentPlayer = returnPlayer;
            }
            else{
                victoire ++;
            }

            if(victoire == 3){

                return returnPlayer;
            }
        }
    }

    async checkWinHorizontal() {
        let valeur = null;
        let result = null;

        for(let line of this._board){
            valeur = null;
            result = line.every( (val, i, arr) => {
                if(val === arr[0]){
                    valeur = val;
                    return val + 1;
                }
                else{
                    return false;
                }

            });

            if(result) return valeur;
        }
    }

    async checkWinElement(){
        let lastPlayer = null, playerwin = null, score = 0;

        for(let i = 0; i < this._board.length; i ++){
            score = 1;

            for(let line of this._board){
                if(line[i] != lastPlayer){
                    score = 1;
                    lastPlayer = line[i];
                }
                else{
                    score ++;
                }

                if(score == 3){
                    return lastPlayer;
                    break;
                    // return true;
                }
            }
            if(score == 3){

                break;
                // return true;
            }
        }

        return null;
    }

    async checkWin() {
        let victoire = null;

        victoire = await this.checkWinHorizontal();

        if(victoire == null){
            victoire = await this.checkWinElement();
        }

        if(victoire == null){
            victoire = await this.checkWinElementDiagonal();
        }

        if(victoire == null){
            victoire = await this.checkWinElementDiagonal(true);
        }

        return victoire;
    }
}

module.exports = Board;
