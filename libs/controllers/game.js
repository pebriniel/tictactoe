const Controller = require('../controller.js');

class gameController extends Controller{

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/index.twig', this.view)
    }
}

module.exports = gameController;
