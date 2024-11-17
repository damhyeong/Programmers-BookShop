const connection = require("../mariadb");

const {StatusCodes} = require("http-status-codes");

const allCategory = async (req, res) => {
    const conn = await connection();

    const sql = `SELECT * FROM category`;

    let [result] = await conn.query(
        sql,
    )

    return res.status(StatusCodes.OK).json(result);
}

module.exports = {allCategory};