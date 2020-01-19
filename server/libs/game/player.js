

const Player = class
{

    constructor(user = null)
    {
        this._session = null;

        this._username = (user['login']) ? user['login'] : 'player';
        this._id = (user['id']) ? user['id'] : null;

        this._score = 0;
    }

    getId()
    {
        return this._id;
    }

    getUsername()
    {
        return this._username;
    }

    setUsername(username)
    {
        this._username = username;
    }

    getScore()
    {
        return this._score;
    }

    addScore(val = 1)
    {
        this.setScore(val);
    }
    removeScore(val = -1)
    {
        this.setScore(val);
    }

    setScore(val)
    {
        this._score += val;
    }
}

module.exports = Player;
