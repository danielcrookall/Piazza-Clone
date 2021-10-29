const mysql = require('mysql');

require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.CWL,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
};

let connection;

const handleDisconnect = () => {
    console.log('create mysql connection');
    connection = mysql.createConnection(dbConfig);

    // connect
    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // run again after 2s
        }
    });

    //error時の処理
    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });

    module.exports = connection;
}

handleDisconnect();