const mysql = require("mysql");
const dbConfStr = {
    host: 'localhost',
    user: 'root',
    password: 'asdfss5523',
    port: '3306',
    database: 'money',
    /*database: 'money2018',*/
};

const pool = mysql.createPool(dbConfStr);

let query = function (sql, values, ifResultFields) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) { reject(err); }
            else {
                connection.query(sql, values, (err, rows, fields) => {
                    if (err) { reject(err) }
                    else { resolve( rows ) }
                    connection.release()
                })
            }
        })
    })
}

module.exports = {
    query,
    dbConfStr
};
