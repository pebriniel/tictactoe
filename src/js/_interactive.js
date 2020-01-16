
var Interactive = {
    //Si le joueur recherche une partie
    searchGame: function(e){
        Online.sendActionSpecific('game search', true);
    },

    //Si le joueur quitte la recherche une partie
    searchGameLeave: function(e){
        Online.sendActionSpecific('game leavesearch', false);
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

    setAction: function(value) {
        this._action = value;
    },

    getAction: function() {
        return this._action;
    }

}
