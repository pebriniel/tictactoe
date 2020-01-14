const Controller = require('../controller.js');

class chatController extends Controller{

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('chat/index.twig', this.view)
    }
}

module.exports = chatController;
