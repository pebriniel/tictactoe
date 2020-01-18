const Controller = require('../controller.js');
const uniqid = require('uniqid');

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
}

module.exports = UserController;
