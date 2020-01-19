const Controller = require('../controller.js');

class chatController extends Controller{

    constructor(req, res)
    {
        super()
    }

    async exec()
    {
        try{
            this.view.user = await this.getUser();
            return this.render('chat/index.twig');
        }
        catch{
            
        }
    }
}

module.exports = chatController;
