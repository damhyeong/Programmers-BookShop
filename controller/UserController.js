const connection = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");

const crypto = require("node:crypto");

const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {

    const {email, password} = req.body;

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    let values = [email, hashPassword, salt];

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err) {
                console.log(err);
                // BAD REQUEST
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.CREATED).json(results);
            }
        }
    )
}

const login = async (req, res) => {
    const conn = await connection();

    const {email, password} = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;
    const value = [email];

    let results, fields;

    try{
        [results, fields] = await conn.query(
            sql,
            value,

        )
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    if(!loginUser){
        console.log("해당 유저를 찾을 수 없음.");
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    const salt = loginUser.salt;
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    console.log(password);
    console.log(hashPassword);
    console.log(loginUser.password);

    if(loginUser && loginUser.password === hashPassword){
        const token = jwt.sign({
            id : loginUser.id,
            email : loginUser.email
        }, process.env.PRIVATE_KEY, {
            expiresIn: "5m",
            issuer : "damsoon"
        });

        res.cookie("token", token, {
            httpOnly : true
        });

        console.log(token);

        return res.status(StatusCodes.OK).json(results);
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
}

const postReset = (req, res) => {
    const {email} = req.body;

    const sql = "SELECT * FROM users WHERE email = ?"
    const value = [email];

    conn.query(
        sql,
        value,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];

            if(user){
                return res.status(StatusCodes.OK).json({
                    email : email
                });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
}

const putReset = (req, res) => {
    const {email, password} = req.body;

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`
    const values = [hashPassword, salt, email];

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.affectedRows === 0){
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
}

module.exports = {join, login, postReset, putReset};
