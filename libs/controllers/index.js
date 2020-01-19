const Controller = require('../controller.js');

class IndexController extends Controller
{

    constructor(req, res)
    {
        super(req, res);
    }

    exec()
    {

        return this.getRes().render('index/index.twig', this.view)
    }
}

module.exports = IndexController;
