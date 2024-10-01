const express = require("express");
const router = express.Router();

const {body, validateResult} = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
    const err = validateResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

// 회원가입
router.post("/join",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isString(),
        validate
    ],
    (req, res) => {
    res.json({
        message : "join"
    })
})

// 로그인
router.post("/login",
    [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isString(),
        validate
    ],
    (req, res) => {
    res.json({
        message : "login"
    })
})

// 비밀번호 초기화 요청
router.post("/reset",
    [
        body("email").notEmpty().isEmail(),
        validate
    ],
    (req, res) => {
    res.json({
        message : "reset"
    })
})

// 비밀번호 초기화
router.put("/reset",
    [
        body("password").notEmpty().isString(),
        validate
    ],
    (req, res) => {
    res.json({
        message : "resset"
    })
})


module.exports = router;
