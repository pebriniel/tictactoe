
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

    checkWin() {


    }
}
