const Controller = require('../controller.js');
const uniqid = require('uniqid');

const Replay = require('../services/Replay.js');

class UserController extends Controller{

    async login(req, res) {

        this._req = req;
        this._res = res;

        var username = (req.body.username) ? req.body.username : '';
        var password = (req.body.password) ? req.body.password : '';

        this.init();

        //On récupère la session utilisateur s'il est déjà connecté
        try{
            let status = await this.isConnected()

            // S'il est déjà connecté, on le redirige sur l'accueil
            if(status){
                return this._res.redirect('/')
            }
            else if(username == '' || password == ''){
                this.view.connected = false;
                this.view.input_empty = true;

                return this._res.render('user/login.twig', this.view);
            }
            else{
                try {

                    let data = await this.user.checkLogin(username, password);

                    if(data > 0){

                        this.user.loadModel();
                        let _uniqid = uniqid();

                        this.user.setCookie(_uniqid);
                        this._res.cookie("userSession", _uniqid);

                        this.view.connected = data;

                        return this._res.redirect('/');
                    }

                    return this._res.render('user/login.twig', this.view);
                }
                catch(err){

                    this.view.error = err;
                    return this._res.render('user/login.twig', this.view);

                }
            }

        }
        catch{

        }
    }

    logout(req, res) {
        res.cookie("userSession", '');

        return res.redirect('/');
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

            const replay = new Replay();

            this.view.replays = await replay.getListReplays({'player': 1});

            return this._res.render('user/replay.twig', this.view);

        }
        catch{

        }
    }
}

module.exports = UserController;
