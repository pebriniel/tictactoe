
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
