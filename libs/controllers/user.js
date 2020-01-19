const bcrypt = require("bcrypt");
const uniqid = require('uniqid');
const { check, validationResult } = require('express-validator');

const Controller = require('../controller.js');
const Replay = require('../models/Replay.js');

class UserController extends Controller{

    constructor(req, res)
    {
        super(req, res);
    }

    // L'action de la création de compte
    async registerPost()
    {
        //On récupère les données du formulaire
        const login = this.getReq().body.loginRegister;
        const password = this.getReq().body.passwordRegister;
        const email = this.getReq().body.emailRegister;

        const errors = validationResult(this.getReq());

        if (!errors.isEmpty())
        {
            console.log('il y a des erreurs');
            const extractedErrors = []
            errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
            this.getReq().session.errors = errors;
        }
        else
        {
            try{
                let checkLogin = await this.user.checkUsername(login);
                let checkEmail = await this.user.emailExists(email);

                // Si les données n'existe pas.
                if(checkLogin == undefined && checkEmail == undefined)
                {
                    //On enregistre le compte utilsateur
                    const user = this.user;
                    bcrypt.hash(password, 10, function(err, hash) {
                        user.save([login, email, hash, 1]);
                    });
                }
                // Sinon, on enregistre en session les erreurs que l'on a rencontrés.
                else{
                    this.getReq().session.errors = {
                        'loginRegister': (checkLogin != undefined) ? true : false,
                        'emailRegister': (checkEmail != undefined) ? true : false
                    };
                }

            }
            finally{

            }
        }

        return this.redirectTo('/user/login');

    }


    // L'action de connexion
    async login()
    {

        const login = (this.getReq().body.login) ? this.getReq().body.login : '';
        const password = (this.getReq().body.password) ? this.getReq().body.password : '';

        this.view.errors = this.getReq().session.errors;

        try{

            this.view.user = await this.getUser();

            // S'il est déjà connecté, on le redirige sur l'accueil
            if(this.view.user){
                return this.redirectTo('/')
            }
            else if(login == '' || password == ''){
                return this.render('user/login.twig');
            }
            else{
                try {

                    let data = await this.user.checkLogin(login, password);

                    console.log(data);

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

                    console.log(err);
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


    // L'action de déconnexion
    logout()
    {
        this.getRes().cookie("userSession", '');

        return this.redirectTo('/');
    }

    // La liste des replays
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
