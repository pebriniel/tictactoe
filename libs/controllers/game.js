const Controller = require('../controller.js');

class gameController extends Controller{

    select(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/select.twig', this.view)
    }

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/local.twig', this.view)
    }

    execOnline(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/online.twig', this.view)
    }
}

module.exports = gameController;
