
var Game = {

    _format: {
        0: 3, // 3x3
        1: 5, // 5x5
        2: 7 // 7x7
    },

    init: function(mode = null)
    {
        this._joueurs = [];
        this._currentPlayer = 0;
        this._max = 3;

        if(mode != null && mode != 'null' && mode != undefined){
            this.setLevel(mode);
        }

        if(this._level != 0){
            this._max = 4;
        }

        this.setBoard(new Board());
        this.getBoard().generateBoard();

        if(this.getLevel() == undefined){
            this.setLevel(0);
        }
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
