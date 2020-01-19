const Controller = require('../controller.js');

const Replay = require('../services/Replay.js');

class gameController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    select()
    {

        return this.getRes().render('game/select.twig', this.view);

    }

    exec()
    {

        this.view.mode = 0;
        if(this.getReq().params.mode <= 2){
            this.view.mode = this.getReq().params.mode;
        }

        return this.getRes().render('game/local.twig', this.view);

    }

    execOnline()
    {

        return this.getRes().render('game/online.twig', this.view);

    }

    async replay()
    {
        // Si l'utilsateur n'est pas connecté on le redirige
        if(!this.view.user) {
            return this.getRes().redirect('/')
        }

        if(this.getReq().params.id == undefined || this.getReq().params.id == null || isNaN(this.getReq().params.id)){
            return this.getRes().redirect('/user/replay')
        }

        let idReplay = this.getReq().params.id;

        const replay = new Replay();

        this.view.replay = await replay.getReplay({'idreplay': idReplay});

        if(this.view.replay == undefined)
        {
            return this.getRes().redirect('/user/replay')
        }

        return this.getRes().render('game/replay.twig', this.view);
    }
}

module.exports = gameController;
