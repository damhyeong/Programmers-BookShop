const express = require("express");
const router = express.Router();

router.use(express.json());

const {
    addOrder,
    getOrders,
    getOrderDetail
} = require("../controller/OrderController")

router
    .route("/")
    .post(
        addOrder
    )
    .get(
        getOrders
    )

router
    .get("/:id",
        getOrderDetail
    )

module.exports = router;