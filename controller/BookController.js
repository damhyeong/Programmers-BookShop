const ensureAuthorization = require("../auth");
const connection = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");

const allBooks = async (req, res) => {
    const conn = await connection()

    let {category_id, news, limit, currentPage} = req.query;

    const offset = parseInt(limit) * (parseInt(currentPage) - 1);

    let sql = "SELECT SQL_CALC_FOUND_ROWS * FROM books";
    let countSQL = "SELECT COUNT(*) AS total_num FROM books";
    let values = [];

    if(category_id && news){
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        countSQL += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [category_id];
    } else if (category_id){
        sql += " WHERE category_id = ?";
        countSQL += " WHERE category_id = ?";
        values = [category_id];
    } else if(news){
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        countSQL += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

    let results;
    try{
        [results] = await conn.query(
            sql,
            values
        )
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    let totalPage;
    try {
        const [countResults] = await conn.query(
            countSQL,
            values
        );

        // or

        /*
        * await conn.query("SELECT found_rows()")
        * */

        totalPage = countResults[0]["total_num"];
        console.log(totalPage);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    let returnObject = {};
    if(results){
        results.map((result) => {
            result["pubDate"] = result["pub_date"];
            delete result["pub_date"];
        });

        returnObject["books"] = results;

        const pagination = {
            currentPage : currentPage,
            totalBooks : totalPage
        }

        returnObject["pagination"] = pagination;

        return res.status(StatusCodes.OK).json(returnObject);
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
}

const bookDetail = async (req, res) => {
    const conn = await connection();

    let jwtPayload;
    let userId;
    if(req.headers["authorization"]) {
        jwtPayload = ensureAuthorization(req, res);

        if(jwtPayload instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 jwt 토큰 세션이 만료됨. 다시 로그인 해 주세미."
            });
        } else if (jwtPayload instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message : "해당 토큰은 형식에 맞지 않거나, 검증되지 않는 토큰입니다."
            })
        }
        userId = jwtPayload["id"];
    }

    let {bookId} = req.params;

    bookId = parseInt(bookId);

    let sql;
    let value;
    if (userId) {
        sql = `SELECT *,
                    (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
                    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`
        value = [userId, bookId, bookId]
    } else {
        sql = `SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`
        value = [bookId];
    }

    let results;
    try {
        [results] = await conn.query(
            sql,
            value
        )

        const book = results[0];
        if(book){
            return res.status(StatusCodes.OK).json(book);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {allBooks, bookDetail};