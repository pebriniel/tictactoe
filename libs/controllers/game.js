const Controller = require('../controller.js');

const Replay = require('../services/Replay.js');

class gameController extends Controller{

    select(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/select.twig', this.view)
    }

    exec(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        this.view.mode = 0;
        if(req.params.mode <= 2){
            this.view.mode = req.params.mode;
        }

        return this._res.render('game/local.twig', this.view)
    }

    execOnline(req, res) {

        this._req = req;
        this._res = res;

        this.init();

        return this._res.render('game/online.twig', this.view)
    }

    async replay(req, res)
    {
        this._req = req;
        this._res = res;

        this.init();

        //On récupère la session utilisateur s'il est déjà connecté
        try{
            let status = await this.isConnected()

            // Si l'utilsateur n'est pas connecté on le redirige
            if(!status) {
                return this._res.redirect('/')
            }

            if(req.params.id == undefined || req.params.id == null || isNaN(req.params.id)){
                return this._res.redirect('/user/replay')
            }

            let idReplay = req.params.id;

            const replay = new Replay();

            this.view.replay = await replay.getReplay({'idreplay': idReplay});

            if(this.view.replay == undefined)
            {
                return this._res.redirect('/user/replay')
            }

            return this._res.render('game/replay.twig', this.view);

        }
        catch{

        }
    }
}

module.exports = gameController;
