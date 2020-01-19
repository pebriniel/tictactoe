const libUser = require('./services/User');

class Controller{

    constructor(req = null, res = null)
    {
        this._req = req;
        this._res = res;

        this._redirect = false;

        this.user = new libUser.User();
        this.view = new Object();

    }

    getUser()
    {
        let cookie = (this.getReq().cookies != undefined && this.getReq().cookies['userSession']) ? this.getReq().cookies['userSession'] : 'empty';

        return this.user.isConnected(cookie);
    }

    getReq()
    {
        return this._req;
    }

    getRes()
    {
        return this._res;
    }

    setRedirect(redirect = false)
    {
        this._redirect = redirect;
    }

    getRedirect()
    {
        return this._redirect;
    }

    redirectTo(path)
    {
        this.setRedirect(true);
        return this.getRes().redirect(path);
    }

    render(template)
    {
        if(!this.getRedirect()){
            return this.getRes().render(template, this.view);
        }
    }

}

module.exports = Controller;
