const libUser = require('./services/User');

class Controller{

    init(){
        this.user = new libUser.User();
        this.view = new Object();
    }

    failureCallback(erreur) {
      console.error("L'opération a échoué avec le message : " + erreur);
    }

    isConnected(){
        var cookie = (this._req.cookies['userSession']) ? this._req.cookies['userSession'] : 'empty';

        return this.user.isConnected(cookie);
    }
}

module.exports = Controller;
