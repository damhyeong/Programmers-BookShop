const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ensureAuthorization = (req, res) => {
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

module.exports = ensureAuthorization;