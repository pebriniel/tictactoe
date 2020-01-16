const Game = require('./game.js');

var Interactive = {

    init: function(game){
        this._game = game;
    },

    //Si le joueur clique sur une case
    ClickOnCase: function(action, player) {
        const currentPlayer = this._game.currentPlayer();

        if(currentPlayer == player)
        {

            const variable = Interactive.ChangeCaseValue(action);

            if(variable == true)
            {
                action.player = currentPlayer;
                this.setAction(action);

                this._game.alternatePlayer();
            }
            else{
                if(variable == -2)
                {
                    this.setActionValide(`La case n'est plus disponible`);
                }
                else
                {
                    this.setActionError(`La case n'est pas disponible`);
                }
            }
        }
        else{
            this.setActionError(`Ce n'est pas votre tour`);
        }
    },

    //On vérifie les valeurs de la case
    ChangeCaseValue: function(action){
        const format = this._game.getFormat(this._game.getLevel());
        const board = this._game._board;
        const currentPlayer = this._game.currentPlayer();

        //Sélection
        const line = action.x;
        const column = action.y;

        if(line < format && column < format){
            if(board.getValue(line, column) == null)
            {
                board.setValue(line, column, currentPlayer);
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

    setActionMessage: function(type, message) {
        this.setAction({action: 'pushMessage', type: type, 'message': message});
    },

    setActionError: function(message) {
        this.setActionMessage('erreur', message);
    },

    setActionValide: function(message) {
        this.setActionMessage('valide', message)
    },

    setAction: function(value) {
        this._action = value;
    },

    getAction: function() {
        return this._action;
    }
}

module.exports = Interactive;
