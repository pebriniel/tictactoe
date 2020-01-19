const LibMysql = require("../mysql.js");

class Replay
{

    constructor()
    {
        this.player_a = null;
        this.player_b = null;
        this.victoire_a = 0;
        this.victoire_b = 0;
    }

    setPlayerA(valeur = null)
    {
        this.player_a = valeur;
    }

    setPlayerB(valeur = null)
    {
        this.player_b = valeur;
    }

    setWinA(valeur = 0)
    {
        this.victoire_a = valeur;
    }

    setWinB(valeur = 0)
    {
        this.victoire_b = valeur;
    }


    async save(data = null)
    {
        var mysqlConnexion = new LibMysql();
        if(data != null)
        {
            try{
                let connection = await mysqlConnexion.start();

                let sql_template = "INSERT INTO `replays` (player_a, player_b, win_a, win_b, data) VALUES(?, ?, ?, ?, ?) ";

                let replaces = [this.player_a, this.player_b, this.victoire_a, this.victoire_b, JSON.stringify(data)];
                let sql = mysqlConnexion.mysql.format(sql_template, replaces);

                return mysqlConnexion.insert(connection, sql);
            }
            catch{

            }
        }
    }

    getSQLReplay(params = {})
    {
        let params_request = [];
        let sql_template = `SELECT r.id, r.win_a, r.win_b, ua.login AS username_a, ub.login AS username_b, player_a, player_b, r.data FROM replays r
                                                LEFT JOIN utilisateurs ub ON ub.id = r.player_b
                                                LEFT JOIN utilisateurs ua ON ua.id = r.player_a
                                                WHERE 1 `;

        if(params['idreplay'])
        {
            sql_template += ' AND r.id = ?';
            params_request.push(params['idreplay']);
        }

        if(params['player'])
        {
            sql_template += ' AND (r.player_a = ? || r.player_b = ?)';
            params_request.push(params['player']);
            params_request.push(params['player']);
        }

        return {sql: sql_template, params: params_request};
    }

    async getReplay(params = null)
    {
        var mysqlConnexion = new LibMysql();
        if(params != null)
        {
            try{
                let connection = await mysqlConnexion.start();

                let prepare = await this.getSQLReplay(params);

                let sql = mysqlConnexion.mysql.format(prepare.sql, prepare.params);

                return mysqlConnexion.queryOne(connection, sql);
            }
            catch{

            }
        }
    }

    async getListReplays(params = null)
    {
        var mysqlConnexion = new LibMysql();
        if(params != null)
        {
            try{

                let connection = await mysqlConnexion.start();

                let prepare = await this.getSQLReplay(params);

                let sql = mysqlConnexion.mysql.format(prepare.sql, prepare.params);

                return mysqlConnexion.queryAll(connection, sql);
            }
            catch{

            }
        }
    }
}

module.exports = Replay;
