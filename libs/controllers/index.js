const Controller = require('../controller.js');

class IndexController extends Controller{

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('index/index.twig', this.view)
    }
}

module.exports = IndexController;
