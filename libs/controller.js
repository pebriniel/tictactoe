const libUser = require('./services/User');

class Controller{

    constructor(req = null, res = null)
    {
        this._req = req;
        this._res = res;

        this.user = new libUser.User();
        this.view = new Object();

        let _this = this;
        this.view.user = (async () => {

            return await _this.isConnected();

        });

    }

    failureCallback(erreur)
    {
      console.error("L'opération a échoué avec le message : " + erreur);
    }

    async isConnected()
    {

        const cookie = (this.getReq().cookies != undefined && this.getReq().cookies['userSession']) ? this.getReq().cookies['userSession'] : 'empty';

        return await this.user.isConnected(cookie);

    }

    getReq()
    {
        return this._req;
    }

    getRes()
    {
        return this._res;
    }
}

module.exports = Controller;
