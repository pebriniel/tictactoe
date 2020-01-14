
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
                var dcase = document.createElement("div");

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
}


var Game = {
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


var Interactive = {


    //Si le joueur clique sur une case
    ClickOnCase: function(e){

        let variable = Interactive.ChangeCaseValue(this);

        if(variable == true){
            const currentPlayer = Game.currentPlayer();

            this.dataset.player = currentPlayer;
            this.classList.add(`case-${currentPlayer}`);

            Game.alternatePlayer();
            // showMessage(``);
            console.log('ok');
            // checkWin();

        }
        else{
            if(variable == -2)
            {
                console.log('plus disponible');
                // showMessage(`La case n'est plus disponible`);
            }
            else
            {
                console.log('pas disponible');
                // showMessage(`La case n'est pas disponible`);
            }
        }

    },

    //On change les valeurs de la case
    ChangeCaseValue: function(element){
        let format = Game.getFormat(Game.getLevel());

        //Sélection
        let line = element.dataset.line;
        let column = element.dataset.column;

        if(line < format && column < format){
            if(element.dataset.player == null)
            {
                return true;
            }
            else{
                return -2;
            }
        }
        else{
            return false;
        }
    }
}


const Player = class {
    constructor() {
        this._session = null;
        this._username = 'player';
        this._score = 0;
    }

    getUsername() {
        return this._username;
    }

    setUsername(username) {
        this._username = username;
    }

    getScore() {
        return this._score;
    }

    addScore(val = 1){
        this.setScore(val);
    }
    removeScore(val = -1){
        this.setScore(val);
    }

    setScore(val) {
        this._score += val;
    }
}




// Game.init();
//
// Game.addPlayer('boussad');
// Game.addPlayer('gabriel');<


const chat = function(){
    var form = document.querySelector("#chat");

    console.log(form);
     // … et prenez en charge l'événement submit.
     form.addEventListener("submit", function (event) {
         event.preventDefault();

         const m = document.querySelector("#m");
         socket.emit('chat message', m.value);
         m.value = '';
     });

     socket.on('chat message', function(msg){
         let li = document.createElement("li");
         li.innerHTML = msg;
         messages.appendChild(li);
       // window.scrollTo(0, document.body.scrollHeight);
     });
}
