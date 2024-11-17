const connection = require("../mariadb");
const {StatusCodes} = require("http-status-codes");
const jwt = require("jsonwebtoken");

const crypto = require("node:crypto");

const dotenv = require("dotenv");
dotenv.config();

const join = async (req, res) => {
    const conn = await connection();

    const {email, password} = req.body;

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    let values = [email, hashPassword, salt];

    try{

        let [result] = await conn.query(
            sql,
            values
        );
        return res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
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


    if(loginUser && loginUser.password === hashPassword){
        const token = jwt.sign({
            id : loginUser.id,
            email : loginUser.email
        }, process.env.PRIVATE_KEY, {
            expiresIn: "10m",
            issuer : "damsoon"
        });

        res.cookie("token", token, {
            httpOnly : true
        });


        return res.status(StatusCodes.OK).json({...results[0], token: token});
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
}

const postReset = async (req, res) => {
    const conn = await connection();

    const {email} = req.body;

    const sql = "SELECT * FROM users WHERE email = ?"
    const value = [email];

    try {
        let [results] = await conn.query(
            sql,
            value,
        );

        const user = results[0];
        if (user) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }


    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

}

const putReset = async (req, res) => {
    const conn = await connection();

    const {email, password} = req.body;

    const salt = crypto.randomBytes(64).toString("base64");
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("base64");

    const sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`
    const values = [hashPassword, salt, email];

    try{

        let results = await conn.query(
            sql,
            values,
        )

        if (results.affectedRows === 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }

    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
}

module.exports = {join, login, postReset, putReset};
