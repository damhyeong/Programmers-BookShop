const mariadb = require("mysql2/promise");

const conn = async() => {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "Bookshop",
        dateStrings: true
    });

    return conn;
}

module.exports = conn;