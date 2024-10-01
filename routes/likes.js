const express = require("express");
const router = express.Router();

const {param, validationResult} = require("express-validator")


router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

router
    .route("/:bookId")
    .post(
        [
            param("bookId").notEmpty().isInt(),
            validate
        ],
        (req, res) => {
        const {bookId} = req.params;
    })
    .delete(
        [
            param("bookId").notEmpty().isInt(),
            validate
        ],
        (req, res) => {
        const {bookId} = req.params;
    })


module.exports = router;