
const Board = class {

    constructor(idElement = 'boards') {
        this._idElement = idElement;
        this._board = document.querySelector(`#${idElement}`);
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

                if(victoire == (Game._max -1)){

                    return returnPlayer;
                }
            }
        }
    }

    checkWinElementSpecific(name = 'line') {
        let victoire = false;

        for(let column = 0; column < Game.getFormat(Game.getLevel()); column ++){

            if(victoire = this.checkWinElement(`[data-${name}~="${column}"]`), true) {

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

                //Si la condition de victoire dépasse le nombre de case
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


var Game = {

    _format: {
        0: 3, // 3x3
        1: 5, // 5x5
        2: 7 // 7x7
    },

    init: function(mode = 0){

        this._joueurs = [];
        this._currentPlayer = 0;
        this._level = mode;
        this._max = 3;

        if(mode != 0){
            this._max = 4;
        }

        this._board = new Board();
        this._board.generateBoard();
    },

    clear: function(relaunch = false, action = {}){
        Interactive.cleanBoard(action);

        if(relaunch){
            this.init();
            Game.addPlayer('boussad');
            Game.addPlayer('gabriel');
        }
    },

    getPlayers: function(){
        return this._joueurs;
    },

    addPlayer: function(session){
        player = new Player();

        player.setSession(session);

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
    },

    getBoard: function(){
        return this._board;
    }
}



var Interactive = {
    //Si le joueur recherche une partie
    searchGame: function(e){
        Online.sendActionSpecific('game search', true);

        searchgameleaveBlock.classList.remove('hidden');
        searchgameBlock.classList.add('hidden');
    },

    //Si le joueur quitte la recherche une partie
    searchGameLeave: function(e){
        Online.sendActionSpecific('game leavesearch', false);

        searchgameBlock.classList.remove('hidden');
        searchgameleaveBlock.classList.add('hidden');
    },

    //On affiche l'écran de victoire
    screenEndGame: function(action = {}){

        //On clean le chat
        chatClean();

        if(typeof winSplash !== 'undefined'){
            winSplash.classList.add('hidden');
            if(action.win != undefined && action.win){
                winSplash.classList.remove('hidden');
            }
        }

        if(typeof looseSplash !== 'undefined'){
            looseSplash.classList.add('hidden');
            if(action.loose != undefined && action.loose){
                looseSplash.classList.remove('hidden');
            }
        }

        if(typeof searchgameBlock !== 'undefined'){
            searchgameBlock.classList.remove('hidden');
        }

        if(typeof searchgameleaveBlock !== 'undefined'){
            searchgameleaveBlock.classList.add('hidden');
        }

        if(typeof searchBlock !== 'undefined'){
            searchBlock.classList.remove('hidden');
            boardBlock.classList.add('hidden');
        }

        if(action.reset != undefined && action.reset){
            searchBlock.classList.add('hidden');
            boardBlock.classList.remove('hidden');
        }

    },

    cleanBoard: function(action = {}){
        this.screenEndGame(action);
        boards.innerHTML = '';
    },

    //Si le joueur clique sur une case
    ClickOnCase: function(e){
        let variable = Interactive.ChangeCaseValue(this);

        if(Online.online && variable == true){
            let action = Interactive.getAction();
            Online.sendAction(JSON.stringify(action));
        }
        else if(variable == true){
            const currentPlayer = Game.currentPlayer();

            Game.alternatePlayer();

            Game.getBoard().setCasePlayer(this, {player: currentPlayer});

            if(Game.getBoard().checkWin()){
                console.log('ok');
                Interactive.screenEndGame({win: 1});
            }
        }
        else if(variable == -2)
        {
            pushMessage({type: 'erreur', message: `La case n'est plus disponible`});
        }
        else
        {
            pushMessage({type: 'erreur', message: `La case n'est plus disponible`});
        }
    },

    //On vérifie les valeurs de la case
    ChangeCaseValue: function(element){
        let format = Game.getFormat(Game.getLevel());

        //Sélection
        let line = element.dataset.line;
        let column = element.dataset.column;

        this.setAction({action: 'ChangeCaseValue', x: line, y: column});

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
    },

    beforeleavePage: function(e) {
        if(!e) e = window.event;
        //e.cancelBubble is supported by IE - this will kill the bubbling process.
        e.cancelBubble = true;
        e.returnValue = 'Êtes vous sûr de vouloir quitter ?'; //This is displayed on the dialog

        //e.stopPropagation works in Firefox.
        if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
        }
    },

    loadButtonReset: function(action = {}) {
        if(Online.online == false){
            Game.clear(true, action);
        }
    },

    leavePage: function(e) {
        Online.sendActionSpecific('game leave', true);
    },

    setAction: function(value) {
        this._action = value;
    },

    getAction: function() {
        return this._action;
    }

}



var Online = {
    online: false,

    sendAction: function(action){
        socket.emit('game action', action);
    },

    sendActionSpecific: function(action, value){
        socket.emit(action, action);
    }
}


const Player = class {
    constructor() {
        this._session = null;
        this._username = 'player';
        this._score = 0;
    }

    getSession() {
        return this._username;
    }

    setSession(session) {
        this._session = session;
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


const chat = function(channel = 'chat'){
    let form = document.querySelector("#chat");

    if(form){
        // … et prenez en charge l'événement submit.
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const m = document.querySelector("#m");
            socket.emit(`${channel} message`, m.value);
            m.value = '';
        });

        socket.on(`${channel} message`, function(msg){
            pushMessage({type: 'message', message: msg});
            // let li = document.createElement("li");
            // li.innerHTML = msg;
            // messages.appendChild(li);
        });
    }

     let formUsername = document.querySelector("#formUsername");
     if(formUsername){
         formUsername.addEventListener("submit", function (event) {
             event.preventDefault();

             const username = document.querySelector("#username");
             socket.emit(`${channel} username`, username.value);
             username.value = '';
         });
     }
}

const chatClean = function(){
    if(typeof messages !== 'undefined'){
        messages.innerHTML = '';
    }
}


const pushMessage = function(message) {
    let messages = document.querySelector('#messages');

    if(messages){
        let li = document.createElement("li");
        li.classList.add(`type-${message.type}`);

        li.innerHTML = message.message;
        messages.appendChild(li);

        containerMessage.scrollTop = containerMessage.scrollHeight;
    }
}
