
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


    checkWinElementDiagonal(reverse = false){
        let currentPlayer = null;
        let victoire = 0;
        let column, returnPlayer;

        //On quadrille l'ensemble du tableau X * X
        for(let c = 0; c < 2 * (Game.getFormat(Game.getLevel()) - 1) ; c ++){

            for(let line = (Game.getFormat(Game.getLevel()) - 1); line >= 0; line --){

                column = c - line;
                if(reverse)
                {
                    column = c - (Game.getFormat(Game.getLevel()) - line);
                }


                returnPlayer = this.checkWinElement(`[data-line~="${line}"][data-column~="${column}"]`, true);

                if(returnPlayer != currentPlayer || returnPlayer == null || returnPlayer == undefined){
                    victoire = 1;
                    currentPlayer = returnPlayer;
                }
                else if(column >= 0 && column < Game.getFormat(Game.getLevel())){
                    victoire ++;
                    console.log('c '+column+' l : '+line);
                }

                if(victoire == Game._max){
                    console.log('c '+column+' l : '+line);
                    return returnPlayer;
                }
            }

            victoire = 1;
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


var Game = {

    _format: {
        0: 3, // 3x3
        1: 5, // 5x5
        2: 7 // 7x7
    },

    init: function(mode = null, resetPlayer = true)
    {
        if(resetPlayer){
            this._joueurs = [];
        }

        this._currentPlayer = 0;
        this._max = 3;

        if(mode != null && mode != 'null' && mode != undefined){
            this.setLevel(mode);
        }
        else if(this.getLevel() == undefined){
            this.setLevel(0);
        }

        if(this._level != 0){
            this._max = 4;
        }

        this.setBoard(new Board());
        this.getBoard().generateBoard();

    },

    clear: function(relaunch = false, action = {}){
        Interactive.cleanBoard(action);

        if(relaunch){
            this.init(null, false);
            // Game.addPlayer('boussad');
            // Game.addPlayer('gabriel');
        }
    },

    getPlayer: function(id){
        return this._joueurs[id];
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

    setLevel: function(level){
        this._level = level;
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

    setBoard: function(board = null){
        this._board = board;
    },

    getBoard: function(){
        return this._board;
    }
}



var Interactive = {

    playable: true,

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

    //On mets à jours les scores des deux joueurs
    updateScore: function(idJoueur)
    {
        document.querySelector(`.score-${idJoueur}`).innerHTML = Game.getPlayer(idJoueur).getScore();
    },

    clearScore: function()
    {
        document.querySelectorAll(`.score span`).forEach( item => {
            item.innerHTML = 0;
        });

        Game.getPlayers().forEach(item => {
            item.resetScore();
        });
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

        if(typeof winSplashPlayer !== 'undefined'){
            winSplashPlayer.classList.add('hidden');
            if(action.player != undefined){
                winSplashPlayer.classList.remove('hidden');

                document.querySelectorAll('.winPlayer').forEach(item => { item.classList.add('hidden') });

                document.querySelector(`.player-${action.player}`).classList.remove('hidden');
            }
        }

        if(typeof looseSplash !== 'undefined'){
            looseSplash.classList.add('hidden');
            if(action.loose != undefined && action.loose){
                looseSplash.classList.remove('hidden');
            }
        }

        if(typeof drawSplash !== 'undefined'){
            drawSplash.classList.add('hidden');
            if(action.draw != undefined && action.draw){
                drawSplash.classList.remove('hidden');
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
        if(!Interactive.playable){
            return null;
        }

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

                Game.getPlayer(currentPlayer).addScore();

                Interactive.updateScore(currentPlayer);
                Interactive.screenEndGame({win: 1, player: currentPlayer});
            }
            else if(Game.getBoard().checkDraw()){
                Interactive.screenEndGame({draw: 1});
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

            if(action.clearScore != undefined){
                Interactive.clearScore();
            }
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



var Options = {

    loadOption: function(skin = 'default') {

        const skinLoad = storage.read('skin');
        if(skinLoad != null){
            skin = skinLoad;
        }

        let element = document.querySelector(`.skins a[data-skin="${skin}"]`);
        if(element){
            element.classList.add('active');
        }

        //On charge le skin
        if(!document.getElementById('id2')) {
            var link = document.createElement('link');

            link.id = 'skin';
            link.rel = 'stylesheet';
            link.href = `/static/assets/skins/${skin}/skin.css`;

            document.head.appendChild(link);
        }
    },

    ButtonSelectSkin: (element) => {
        const skin = element.dataset.skin;

        document.querySelector('.skins .active').classList.remove('active');
        element.classList.add('active');

        storage.write('skin', skin);
    }
}

window.addEventListener("load", event => {
    // storage.write('skin', 'default');

    Options.loadOption();
});


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

    addScore(val = +1){
        this.setScore(val);
    }

    removeScore(val = -1){
        this.setScore(val);
    }

    resetScore(val) {
        this._score = 0;
    }

    setScore(val) {
        this._score += val;
    }
}


const storage = {

	read: function(key){
		var monobjet_json = sessionStorage.getItem(key);
		return(JSON.parse(monobjet_json));
	},

	write: function(key, val){
		sessionStorage.setItem(key, JSON.stringify(val));
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
