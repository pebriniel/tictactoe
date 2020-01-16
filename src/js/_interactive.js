

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

            Game.getBoard().setCasePlayer(this, {player: currentPlayer});

            Game.alternatePlayer();

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
