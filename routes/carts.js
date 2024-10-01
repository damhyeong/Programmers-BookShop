const express = require("express");
const router = express.Router();

const {body, param, validationResult} = require("express-validator")



router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

router
    .route("/")
    .post(
        [
            body(["bookId", "count"]).notEmpty().isInt(),
            validate
        ],
        (req, res) => {
            const {bookId, count} = req.body;
    })
    .get(
        [],
        (req, res) => [

    ])

router
    .delete("/:bookId",
        [
            param("bookId").notEmpty().isInt(),
            validate
        ],
        (req, res) => {
        const {bookId} = req.params;
    })

// 4. 주문 "예상" 상품 목록 조회 도 해야함.

module.exports = router;