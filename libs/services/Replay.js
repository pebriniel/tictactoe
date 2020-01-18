const LibMysql = require("../mysql.js");

class Replay
{

    constructor()
    {
        this.joueur_a = null;
        this.joueur_b = null;
        this.victoire_a = 0;
        this.victoire_b = 0;
    }

    async save(data = null)
    {
        var mysqlConnexion = new LibMysql();
        if(data != null)
        {
            try{
                let connection = await mysqlConnexion.start();

                let sql_template = "INSERT INTO `replays` (joueur_a, joueur_b, victoire_a, victoire_b, data) VALUES(?, ?, ?, ?, ?) ";

                let replaces = [this.joueur_a, this.joueur_b, this.victoire_a, this.victoire_b, JSON.stringify(data)];
                let sql = mysqlConnexion.mysql.format(sql_template, replaces);

                return mysqlConnexion.insert(connection, sql);
            }
            catch{

            }
        }
    }

    setJoueurA(valeur = null)
    {
        this.joueur_a = valeur;
    }

    setJoueurB(valeur = null)
    {
        this.joueur_b = valeur;
    }

    setVictoireA(valeur = 0)
    {
        this.victoire_a = valeur;
    }

    setVictoireB(valeur = 0)
    {
        this.victoire_b = valeur;
    }

}

module.exports = Replay;
