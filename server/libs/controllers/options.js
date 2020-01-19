const Controller = require('../controller.js');

class optionsController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    async exec()
    {
        try{
            this.view.user = await this.getUser();
            return this.render('options/index.twig');
        }
        catch{
        }
    }
}

module.exports = optionsController;
