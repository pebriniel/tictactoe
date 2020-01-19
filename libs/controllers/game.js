const Controller = require('../controller.js');

const Replay = require('../services/Replay.js');

class gameController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    async select()
    {
        try{
            this.view.user = await this.getUser();
        }
        finally{
            return this.render('game/select.twig');
        }
    }

    async exec()
    {
        try{
            this.view.user = await this.getUser();

            this.view.mode = 0;
            if(this.getReq().params.mode <= 2){
                this.view.mode = this.getReq().params.mode;
            }
        }
        finally{
            return this.render('game/local.twig');
        }

    }

    async execOnline()
    {
        try{
            this.view.user = await this.getUser();

            if(!this.view.user){
                console.log('disconnect');
                return this.redirectTo('/');
            }
        }
        finally{
            return this.render('game/online.twig');
        }
    }

    async replay()
    {
        try{
            this.view.user = await this.getUser();

            // Si l'utilsateur n'est pas connecté on le redirige
            if(!this.view.user) {
                return this.redirectTo('/')
            }

            if(this.getReq().params.id == undefined || this.getReq().params.id == null || isNaN(this.getReq().params.id)){
                return this.redirectTo('/user/replay')
            }

            let idReplay = this.getReq().params.id;

            const replay = new Replay();

            this.view.replay = await replay.getReplay({'idreplay': idReplay});

            if(this.view.replay == undefined)
            {
                return this.redirectTo('/user/replay')
            }
        }
        finally{
            return this.render('game/replay.twig');
        }
    }
}

module.exports = gameController;
