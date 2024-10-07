const conn = require("../mariadb");

const {StatusCodes} = require("http-status-codes");

const allCategory = (req, res) => {

    const sql = `SELECT * FROM category`;

    conn.query(
        sql,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            if(results){
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    )
}

module.exports = {allCategory};