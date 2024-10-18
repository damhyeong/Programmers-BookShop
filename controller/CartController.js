const connection = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const {TokenExpiredError} = require("jsonwebtoken");

const addToCart = async (req, res) => {
    const conn = await connection();

    const jwtPayload = getJwtPayload(req, res);

    if(jwtPayload instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 jwt 토큰 세션이 만료됨. 다시 로그인 해 주세미."
        });
    } else if (jwtPayload instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "해당 토큰은 형식에 맞지 않거나, 검증되지 않는 토큰입니다."
        })
    }

    const user_id = jwtPayload["id"];

    const {book_id, quantity} = req.body;

    const sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)"
    const values = [book_id, quantity, user_id];

    try{
        const [results] = await conn.query(
            sql,
            values
        );

        return res.status(StatusCodes.OK).json(results);
    } catch(err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

}

const getCartItems = async (req, res) => {
    const conn = await connection();

    const jwtPayload = getJwtPayload(req, res);

    if(jwtPayload instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 jwt 토큰 세션이 만료됨. 다시 로그인 해 주세미."
        });
    } else if (jwtPayload instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message : "해당 토큰은 형식에 맞지 않거나, 검증되지 않는 토큰입니다."
        })
    }

    const user_id = jwtPayload["id"];

    const {isSelectedArr} = req.body;

    let sql = `SELECT 
                     cartItems.id, book_id, title, summary, quantity, price  FROM cartItems 
                    LEFT JOIN books ON cartItems.book_id = books.id 
                    WHERE user_id = ?`;

    if(isSelectedArr){
        sql += " AND cartItems.id IN (";

        isSelectedArr.forEach((value, index) => {
            if(index !== isSelectedArr.length - 1){
                sql += value.toString() + ", ";
            } else {
                sql += value.toString()
            }
        })

        sql += ")"
    }

    const values = [user_id];

    try{
        const [results] = await conn.query(
            sql,
            values
        );

        if(results){
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const removeCartItems = async (req, res) => {
    const conn = await connection();

    let {id} = req.params;

    id = parseInt(id);

    const sql = "DELETE FROM cartItems WHERE id = ?"
    const values = [id];

    try {
        const [results] = await conn.query(
            sql,
            values
        );

        if (results.affectedRows !== 0) {
            return res.status(StatusCodes.OK).end();
        } else {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                message: "현재 장바구니에 없는 상품입니다."
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

const getJwtPayload = (req, res) => {
    try{
        const receivedJwt = req.headers["authorization"];

        const jwtPayload = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

        return jwtPayload;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}


module.exports = {addToCart, getCartItems, removeCartItems};