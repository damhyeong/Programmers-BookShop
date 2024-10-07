const express = require("express");
const router = express.Router();

const {query ,param, validationResult} = require("express-validator")

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    return err.isEmpty() ? next() : res.status(400).json(err.array());
}

const {allBooks, bookDetail} = require("../controller/BookController");

router.get("/",
    allBooks
)


router.get("/:bookId",
    [
        param("bookId").notEmpty().isInt(),
        validate
    ],
    bookDetail
)



module.exports = router;