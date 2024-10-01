const express = require("express");
const router = express.Router();

const {body,param, validationResult} = require("express-validator")

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

router
    .route("/")
    .post(
        [
            body("items").isArray(),
            body("delivery").isObject(),
            body("totalPrice").notEmpty().isInt(),
            validate
        ],
        (req, res) => {
            const {items, delivery, totalPrice} = req.body;
    })
    .get(
        [],
        (req, res) => {

    })

router
    .get("/:orderId",
        [
            param("orderId").notEmpty().isInt(),
            validate
        ]
        ,(req, res) => {
        const {orderId} = req.params;
    })

module.exports = router;