

const Player = class {
    constructor() {
        this._session = null;
        this._username = 'player';
        this._score = 0;

        this._socket = null;
    }

    getUsername() {
        return this._username;
    }

    setUsername(username) {
        this._username = username;
    }

    getSocket() {
        return this._socket;
    }

    setSocket(socket) {
        this._socket = socket;
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

module.exports = Player;
