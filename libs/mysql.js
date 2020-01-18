const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// module.exports.mysql = mysql;

class mysqlConnexion
{
        constructor()
        {
            this.mysql = mysql;
        }

        start()
        {
            return new Promise(function (resolve, reject) {

                var pool = mysql.createPool({
                  database: process.env.MYSQL_DATABASE,
                  host: process.env.MYSQL_HOST,
                  user: process.env.MYSQL_USER,
                  password: process.env.MYSQL_PASSWORD,
                });

                pool.getConnection(function(err, connection) {
                    if (err) reject(err);

                    resolve(connection);
                });
            });
        }

        queryOne(connection, sql)
        {
            return new Promise(function (resolve, reject) {
                connection.query(sql, function(err, rows, fields) {
                    connection.release();

                    if (err) return reject(err);

                    resolve(rows[0]);
                });
            });
        }

        queryAll(connection, sql)
        {
            return new Promise(function (resolve, reject) {
                connection.query(sql, function(err, rows, fields) {
                    connection.release();

                    if (err) return reject(err);

                    resolve(rows);
                });
            });
        }

        update(connexion, sql){
            this.queryOne(connexion, sql);
        }
}

module.exports = mysqlConnexion;
