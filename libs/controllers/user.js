const Controller = require('../controller.js');
const uniqid = require('uniqid');

const Replay = require('../services/Replay.js');

class UserController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    async login()
    {

        var username = (this.getReq().body.username) ? this.getReq().body.username : '';
        var password = (this.getReq().body.password) ? this.getReq().body.password : '';

        // S'il est déjà connecté, on le redirige sur l'accueil
        if(this.view.user){
            return this.getRes().redirect('/')
        }
        else if(username == '' || password == ''){
            this.view.connected = false;
            this.view.input_empty = true;

            return this.getRes().render('user/login.twig', this.view);
        }
        else{
            try {

                let data = await this.user.checkLogin(username, password);

                if(data > 0){

                    this.user.loadModel();
                    let _uniqid = uniqid();

                    this.user.setCookie(_uniqid);
                    this.getRes().cookie("userSession", _uniqid);

                    this.view.connected = data;

                    return this.getRes().redirect('/');
                }

                return this.getRes().render('user/login.twig', this.view);
            }
            catch(err){

                this.view.error = err;
                return this.getRes().render('user/login.twig', this.view);

            }
        }
    }

    logout() {
        res.cookie("userSession", '');

        return res.redirect('/');
    }

    async replay()
    {

        // Si l'utilsateur n'est pas connecté on le redirige
        if(this.view.user){
            return this.getRes().redirect('/')
        }

        const replay = new Replay();

        this.view.replays = await replay.getListReplays({'player': 1});

        return this.getRes().render('user/replay.twig', this.view);

    }
}

module.exports = UserController;
