const Controller = require('../controller.js');

class optionsController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    exec()
    {

        return this.getRes().render('options/index.twig', this.view);

    }
}

module.exports = optionsController;
