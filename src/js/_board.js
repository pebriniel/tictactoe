
const Board = class {

    constructor(idElement = 'boards') {
        this._idElement = idElement;
        this._board = document.querySelector(`#${idElement}`);
        console.log(this._board);
    }

    generateBoard() {
        let level = Game.getLevel();

        let widthCase = this._board.offsetWidth/Game.getFormat(Game.getLevel());

        for(let line = 0; line < Game.getFormat(Game.getLevel()); line ++){
            let dline = document.createElement("div");

            dline.classList.add('line');

            for(let column = 0; column < Game.getFormat(Game.getLevel()); column ++){
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

        console.log(action);

        el.dataset.player = action.player;
        el.classList.add(`case-${action.player}`);
    }


    checkWinElementDiagonal(inverse = false){
        let currentPlayer = null;
        let victoire = 0;
        let column, returnPlayer;

        for(let line = 0; line < Game.getFormat(Game.getLevel()); line ++){

            column = line;
            if(inverse){
                column = (Game.getFormat(Game.getLevel()) - 1) - line;
            }

            returnPlayer = this.checkWinElement(`[data-line~="${line}"][data-column~="${column}"]`, true);

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

    checkWinElementSpecific(name = 'line') {
        let victoire = false;

        for(let column = 0; column < Game.getFormat(Game.getLevel()); column ++){

            if(victoire = this.checkWinElement(`[data-${name}~="${column}"]`)) {

                return victoire;
            }
        }

        return null;
    }

    checkWinElement(_class, _returnElement = false){
        let elements = null;

        for(let indexPlayer in Game.getPlayers()){

            elements = document.querySelectorAll(`div.case-${indexPlayer}${_class}`);

            if(elements.length == 3 || (elements.length && _returnElement)){
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
