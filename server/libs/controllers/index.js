const Controller = require('../controller.js');

class IndexController extends Controller
{

    constructor(req, res)
    {
        super(req, res);
    }

    async exec()
    {
        try{
            this.view.user = await this.getUser();
        }
        catch{
            return this.render('index/index.twig');
        }

    }
}

module.exports = IndexController;
