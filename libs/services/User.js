const bcrypt = require("bcrypt");
const LibMysql = require("../mysql.js");

class User {

    constructor() {
        this._id = null;
        this._login = 'anonymous';
        this._status = 0;
    }

    async isConnected(cookie){
        var mysqlConnexion = new LibMysql();

        try{
            let connection = await mysqlConnexion.start();

            let sql_template = "Select id, login, status, password from ?? where session = ? ";

            let replaces = ['utilisateurs', cookie];
            let sql = mysqlConnexion.mysql.format(sql_template, replaces);

            return mysqlConnexion.queryOne(connection, sql);
        }
        catch{

        }

    }

    async checkUsername(username){
        var mysqlConnexion = new LibMysql();

        try{

            let connection = await mysqlConnexion.start()

            //Nous sommes connectés, maintenant on check si l'utilisata
            let sql_template = "Select id, login, status, password from ?? where login = ? ";

            let replaces = ['utilisateurs', username];
            let sql = mysqlConnexion.mysql.format(sql_template, replaces);

            return mysqlConnexion.queryOne(connection, sql);
        }
        catch{

        }
    }

    checkPassword(password, row){
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, row.password).then((result) => {
                if(result){
                    resolve(result);
                }

                reject(false);
            });
        });
    }

    async setCookie(_uniqid) {

        var mysqlConnexion = new LibMysql();

        let mysql = LibMysql.mysql;
        let pool = LibMysql.pool;

        try{

            let connection = await mysqlConnexion.start();

            //Nous allons mettre à jour la session de l'utilisateur en BDD
            let sql_template = "update ?? set session = ? where id = ? ";

            let replaces = ['utilisateurs', _uniqid, this._id];
            let sql = mysqlConnexion.mysql.format(sql_template, replaces);

            return mysqlConnexion.update(connection, sql);
        }
        catch{

        }

    }

    loadUser(id){

        var mysqlConnexion = new LibMysql();

        let mysql = LibMysql.mysql;
        let pool = LibMysql.pool;

        return mysqlConnexion.start()
        //Chargement de l'utilisateur sélectionné
        .then((connection) => {

            let sql_template = "SELECT id, login, email, status FROM utilisateurs WHERE id = ?";

            let replaces = [id];
            let sql = mysqlConnexion.mysql.format(sql_template, replaces);

            return mysqlConnexion.queryOne(connection, sql);
        });

    }

    liste(){

        var mysqlConnexion = new LibMysql();

        let mysql = LibMysql.mysql;
        let pool = LibMysql.pool;

        return mysqlConnexion.start()
        //Chargement de l'utilisateur sélectionné
        .then((connection) => {

            let sql = "SELECT id, login, email, status FROM utilisateurs";

            return mysqlConnexion.queryAll(connection, sql);
        });

    }

    checkLogin(username, password){
        return this.checkUsername(username)
            .then((data) => {
                this.data = data;
                if(data){
                    return this.checkPassword(password, data)
                }
                else{
                    return -2;
                }
            })
            .catch((err) => {
                return -1;
            });
    }

    loadModel(data){
        if(data == null){
            data = this.data;
        }

        this._id = data.id;
        this._login = data.login;
        this._status = data.status;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map
