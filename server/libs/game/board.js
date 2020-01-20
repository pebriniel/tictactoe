const Game = require('./game.js');

const Board = class {

    constructor() {
        this._board = [];
        this._countAction = 0;
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

    async checkWinElementDiagonal(reverse = false){
        let currentPlayer = null;
        let victoire = 0;
        let column, returnPlayer;
        let maxSize = this._board.length;

        for(let c = 0; c < 2 * (maxSize - 1) ; c ++){

            for(let line = (maxSize - 1); line >= 0; line --){

                column = c - line;
                if(reverse)
                {
                    column = c - (maxSize - line);
                }

                returnPlayer = this._board[line][column];

                if(returnPlayer != currentPlayer){
                    victoire = 1;
                    currentPlayer = returnPlayer;
                }
                else if(column >= 0 && column < maxSize){
                    victoire ++;
                }

                if(victoire == 3){

                    return returnPlayer;
                }
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

        // égalité !
        if(this.getAction() == (this._board.length * this._board.length)){
            victoire = 2;
        }

        return victoire;
    }

    addAction()
    {
        this._countAction ++;
    }

    getAction()
    {
        return this._countAction;
    }
}

module.exports = Board;
