const Controller = require('../controller.js');

class chatController extends Controller{

    constructor(req, res)
    {
        super()
    }

    exec() {

        return this.getRes().render('chat/index.twig', this.view)
    }
}

module.exports = chatController;
