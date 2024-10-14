const connection = require("../mariadb");

const {StatusCodes} = require("http-status-codes");

const addOrder = async (req, res) => {
    const conn = await connection();

    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;

    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery["address"], delivery["receiver"], delivery["contact"]];

    let delivery_id;

    try{
        const [results] = await conn.query(
            sql,
            values
        )
        delivery_id = results.insertId
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
    console.log("delivery_id : "  + delivery_id)


    sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];

    let order_id;

    try{
        const [results] = await conn.query(
            sql,
            values
        );
        order_id = results.insertId;
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
    values = [];

    items.forEach((value, index) => {
        values.push([order_id, value["book_id"], value["quantity"]])
    })

    try{
        const [results] = await conn.query(
            sql,
            [values]
        );

        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }


    await conn.end();
}

const getOrders = (req, res) => {

}

const getOrderDetail = (req, res) => {

}

module.exports = {addOrder, getOrders, getOrderDetail};