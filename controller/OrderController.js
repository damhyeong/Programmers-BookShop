const conn = require("../mariadb");

const {StatusCodes} = require("http-status-codes");

const addOrder = (req, res) => {
    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;

    let delivery_id;

    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery["address"], delivery["receiver"], delivery["contact"]];

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }
            delivery_id = results.insertId;

        }
    )

    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    let order_id;

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            order_id = results.insertId;

        }
    )

    sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
    values = [];
    items.forEach((value, index) => {
        values.push([order_id, value["book_id"], value["quantity"]])
    })

    conn.query(
        sql,
        [values],
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
}

const getOrders = (req, res) => {

}

const getOrderDetail = (req, res) => {

}

module.exports = {addOrder, getOrders, getOrderDetail};