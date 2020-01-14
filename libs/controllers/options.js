const Controller = require('../controller.js');

class optionsController extends Controller{

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('options/index.twig', this.view)
    }
}

module.exports = optionsController;
