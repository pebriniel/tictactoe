
const Board = class {

    constructor(idElement = 'boards') {
        this._idElement = idElement;
        this._board = document.querySelector(`#${idElement}`);
        console.log(this._board);
    }

    generateBoard() {
        const level = Game.getLevel();

        let widthCase = this._board.offsetWidth/Game.getFormat(level);

        for(let line = 0; line < Game.getFormat(level); line ++){
            let dline = document.createElement("div");

            dline.classList.add('line');

            for(let column = 0; column < Game.getFormat(level); column ++){
                let dcase = document.createElement("div");

                dcase.classList.add('case');

                dcase.dataset.line = line;
                dcase.dataset.column = column;

                dcase.style = 'width:calc('+widthCase+'px - 1.1rem); height:calc('+widthCase+'px - 1.1rem); margin: 0.2rem';
                dcase.addEventListener('click', Interactive.ClickOnCase);

                dline.appendChild(dcase);
            }
            this._board.appendChild(dline);
        }
    }

    setCasePlayer(el, action){
        if(el == null){
            const columns = document.querySelectorAll(`[data-column~="${action.y}"]`);
            el = columns[action.x];
        }

        el.dataset.player = action.player;
        el.classList.add(`case-${action.player}`);
    }


    checkWinElementDiagonal(inverse = false){
        let currentPlayer = null;
        let victoire = 0;
        let column, returnPlayer;

        for(let c = 0; c < Game.getFormat(Game.getLevel()); c ++){

            for(let line = 0; line < Game.getFormat(Game.getLevel()); line ++){

                column = c + line;
                if(inverse){
                    column = (Game.getFormat(Game.getLevel()) - c) - line;
                    column = Math.abs(column);
                }

                returnPlayer = this.checkWinElement(`[data-line~="${column}"][data-column~="${line}"]`, true);

                if(returnPlayer != currentPlayer){
                    victoire = 0;
                    currentPlayer = returnPlayer;
                }
                else if(returnPlayer != null || returnPlayer != undefined){
                    victoire ++;
                }

                if(victoire == Game._max){
                    return returnPlayer;
                }
            }
        }
    }

    checkWinElementSpecific(name = 'line') {
        let victoire = false;

        for(let column = 0; column < Game.getFormat(Game.getLevel()); column ++){

            if(victoire = this.checkWinElement(`[data-${name}~="${column}"]`, false)) {

                return victoire;
            }
        }

        return null;
    }

    checkWinElement(_class, _returnElement = false){
        let elements = null;

        for(let indexPlayer in Game.getPlayers()){

            elements = document.querySelectorAll(`div.case-${indexPlayer}${_class}`);

            if(elements.length == Game._max || (elements.length && _returnElement)){
                return indexPlayer;
            }
        }

        return null;
    }

    checkWin() {
        let victoire = false;

        //On compare les lignes
        victoire = this.checkWinElementSpecific();

        //On compare les columns
        if(!victoire){
            victoire = this.checkWinElementSpecific('column');
        }

        if(!victoire){
            victoire = this.checkWinElementDiagonal();
        }

        if(!victoire){
            victoire = this.checkWinElementDiagonal(true);
        }

        console.log(victoire);

        return victoire;
    }
}
