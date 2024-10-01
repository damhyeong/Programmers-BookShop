const express = require("express");
const router = express.Router();

const {query ,param, validationResult} = require("express-validator")

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

router.get("/",
    [
        query("categoryId").notEmpty().isInt(),
        query("new").notEmpty().isBoolean(),
        validate
    ],
    (req, res) => {
    const {categoryId, isNew} = req.query;

    // categoryId, isNew 쿼리가 있냐 없냐에 따라 나뉘어짐.
});

router.get("/:bookId",
    [
        param("bookId").notEmpty().isInt(),
        validate
    ],
    (req, res) => {
        const {bookId} = req.params;
})



module.exports = router;