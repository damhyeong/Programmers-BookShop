const express = require("express");
const router = express.Router();

const {param, validationResult} = require("express-validator")

const {
    addLike,
    removeLike
} = require("../controller/LikeController")

router.use(express.json());

router
    .route("/:bookId")
    .post(
        addLike
    ).delete(
        removeLike
    )


module.exports = router;