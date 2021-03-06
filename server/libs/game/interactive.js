const Game = require('./game.js');

const Interactive = class {

    constructor(game){
        this._game = game;
    }

    //Si le joueur clique sur une case
    ClickOnCase(action, player) {
        const currentPlayer = this._game.currentPlayer();

        if(currentPlayer == player)
        {

            const variable = this.ChangeCaseValue(action);

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
    }

    //On vérifie les valeurs de la case
    ChangeCaseValue(action){
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
    }

    setActionMessage(type, message) {
        this.setAction({action: 'pushMessage', type: type, 'message': message});
    }

    setActionError(message) {
        this.setActionMessage('erreur', message);
    }

    setActionValide(message) {
        this.setActionMessage('valide', message)
    }

    setAction(value) {
        this._action = value;
    }

    getAction() {
        return this._action;
    }
}

module.exports = Interactive;
