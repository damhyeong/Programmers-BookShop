const express = require("express");
const router = express.Router();

const {body, validationResult} = require("express-validator");
const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const {join, login, putReset, postReset} = require("../controller/UserController")

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

// 회원가입
router.post("/join",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isString(),
        validate
    ],
    join
)

// 로그인
router.post("/login",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isString(),
        validate
    ],
    login
)

// 비밀번호 초기화 요청
router.post("/reset",
    [
        body("email").notEmpty().isEmail(),
        validate
    ],
    postReset
)

// 비밀번호 초기화
router.put("/reset",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isString(),
        validate
    ],
    putReset
)


module.exports = router;
