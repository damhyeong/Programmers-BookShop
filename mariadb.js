const mariadb = require("mysql2");

const conn = mariadb.createConnection({
    host : "localhost",
    user : "root",
    password : "root",
    database : "Bookshop",
    dateStrings : true
});

module.exports = conn;