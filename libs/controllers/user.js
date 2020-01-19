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

        try{

            this.view.user = await this.getUser();

            // S'il est déjà connecté, on le redirige sur l'accueil
            if(this.view.user){
                return this.redirectTo('/')
            }
            else if(username == '' || password == ''){
                this.view.connected = false;
                this.view.input_empty = true;

                return this.render('user/login.twig');
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

                        return this.redirectTo('/');
                    }

                }
                catch(err){

                    this.view.error = err;

                }
                finally{
                    return this.render('user/login.twig');
                }
            }
        }
        catch{

        }
    }

    logout()
    {
        this.getRes().cookie("userSession", '');

        return this.redirectTo('/');
    }

    async replay()
    {

        try{

            this.view.user = await this.getUser();

            // Si l'utilsateur n'est pas connecté on le redirige
            if(!this.view.user){
                return this.redirectTo('/')
            }

            const replay = new Replay();

            this.view.replays = await replay.getListReplays({'player': 1});

            return this.render('user/replay.twig');
        }
        finally{

        }

    }
}

module.exports = UserController;
