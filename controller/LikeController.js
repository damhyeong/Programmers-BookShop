const ensureAuthorization = require("../auth")
const jwt = require("jsonwebtoken");
const connection = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const addLike = async (req, res) => {
    const conn = await connection();

    const {bookId} = req.params;

    const decodedJwt = ensureAuthorization(req, res);

    if(decodedJwt instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 jwt 토큰 세션이 만료됨. 다시 로그인 해 주세미."
        });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "해당 토큰은 형식에 맞지 않거나, 검증되지 않는 토큰입니다."
        })
    }

    const user_id = decodedJwt["id"];
    const email = decodedJwt["email"];

    console.dir(decodedJwt);

    const sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
    const values = [user_id, bookId];

    try{
        const [results] = await conn.query(
            sql,
            values
        )

        return res.status(StatusCodes.OK).json(results);
    } catch(err){
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const removeLike = async (req, res) => {
    const conn = await connection();

    const {bookId} = req.params;

    const decodedJwt = ensureAuthorization(req, res);

    if(decodedJwt instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 jwt 토큰 세션이 만료됨. 다시 로그인 해 주세미."
        });
    } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "해당 토큰은 형식에 맞지 않거나, 검증되지 않는 토큰입니다."
        })
    }

    const user_id = decodedJwt.id;

    const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?`;
    const values = [user_id, bookId];

    try{
        const [results] = await conn.query(sql, values);

        console.log(results);

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = {addLike, removeLike};