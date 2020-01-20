
const Board = class {

    constructor(idElement = 'boards') {
        this._idElement = idElement;
        this._board = document.querySelector(`#${idElement}`);
    }

    generateBoard() {
        const level = Game.getLevel();

        for(let line = 0; line < Game.getFormat(level); line ++){
            let dline = document.createElement("div");

            dline.classList.add('line');
            dline.classList.add('line-'+level);

            for(let column = 0; column < Game.getFormat(level); column ++){
                let dcase = document.createElement("div");

                dcase.classList.add('case');

                dcase.dataset.line = line;
                dcase.dataset.column = column;

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

                returnPlayer = this.checkWinElement(`[data-line~="${line}"][data-column~="${column}"]`, true);

                if(line == 0 || returnPlayer != currentPlayer || returnPlayer == null || returnPlayer == undefined){
                    victoire = 1;
                    currentPlayer = returnPlayer;
                }
                else{
                    victoire ++;
                }

                if(victoire == Game._max){
                    return returnPlayer;
                }

            }

            if(c == (Game.getFormat(Game.getLevel() -1)) || c == 0)
            {
                victoire = 1;
                currentPlayer = returnPlayer;
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

            //Si il y a le bon nombre de case cocher par ligne/column et que l'on ne fait pas une vérification diagonal
            if(elements.length == Game._max || (elements.length && _returnElement)){

                //Si la condition de victoire dépasse le nombre de case (format 5x5 & +)
                if(Game._max > 3 && !(elements.length && _returnElement)){

                    let victoire = 1;
                    let lastLine = null;
                    let lastColumn = null;

                    //On passe élément par élément pour vérifier le bon ordre des cases (éviter les XOXXX mais bien avoir 0XXXX)
                    elements.forEach( element => {

                        //On initie les valeurs le départ en parsant
                        if(lastLine == null && lastColumn == null){
                            lastLine = parseInt(element.dataset.line);
                            lastColumn = parseInt(element.dataset.column);

                            victoire ++;
                        }

                        //Nous comparons n+1 la valeur précédente avec la nouvelle
                        if((lastLine != element.dataset.line && (lastLine + 1) == element.dataset.line) || (lastColumn != element.dataset.column && (lastColumn + 1) == element.dataset.column))
                        {
                            //Si le n1 corresponds nous attributons les nouvelles valeurs à nos variables pour les prochaines vérifications
                            lastLine = parseInt(element.dataset.line);
                            lastColumn = parseInt(element.dataset.column);
                            victoire ++;
                        }
                        // Sinon, on réinitie le total de victoire à 1
                        else{
                            victoire = 1;
                        }



                        //Si nous atteignons la condition de victoire, nous mettons un terme à au forEach
                        if(victoire == Game._max){
                            return indexPlayer;
                        }
                    });

                    if(victoire < Game._max){
                        return null;
                    }
                }

                //Nous retourons l'index du joueur Gagnant.
                return indexPlayer;
            }
        }

        return null;
    }

    checkDraw()
    {
        const format = Game.getFormat(Game.getLevel());
        const count = document.querySelectorAll(`div[data-player]`);

        return count.length == (format * format);
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

        return victoire;
    }
}
