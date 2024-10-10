const express = require("express");
const router = express.Router();

const {body, param, validationResult} = require("express-validator")

const {addToCart, getCartItems, removeCartItems} = require("../controller/CartController");

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

router
    .route("/")
    .get(
        getCartItems
    )
    .post(
        addToCart
    )

router
    .delete("/:id",
        removeCartItems
    )

// 4. 주문 "예상" 상품 목록 조회 도 해야함.
router.get("/")

module.exports = router;