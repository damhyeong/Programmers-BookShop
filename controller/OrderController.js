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


    items;

    sql = "SELECT * FROM cartItems WHERE id IN (?)"

    let [results] = await conn.query(
        sql,
        [items]
    );

    sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
    values = [];

    results.forEach((cartItem) => {
        values.push([ order_id, cartItem["book_id"], cartItem["quantity"] ]);
    })

    try{
        [results] = await conn.query(
            sql,
            [values]
        );
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }

    console.log(items);

    results = await deleteCartItems(items, conn);

    return res.status(StatusCodes.OK).json(results);
}

const deleteCartItems = async (cartIds, conn) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?)`;
    let values = cartIds;

    const result = await conn.query(sql, [values]);
    return result;
}

const getOrders = async (req, res) => {
    const conn = await connection();

    let sql = `
        SELECT orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
        FROM orders
        LEFT JOIN delivery
        ON orders.delivery_id = delivery.id
    `;

    let [rows, fields] = await conn.query(sql);
    return res.status(StatusCodes.OK).json(rows);

}

const getOrderDetail = async (req, res) => {
    const {id} = req.params;

    const conn = await connection();

    let sql = `
        SELECT book_id, title, author, price, quantity
        FROM orderedBook LEFT JOIN books
            ON orderedBook.book_id = books.id
        WHERE order_id = ?
    `;

    let [rows, fields] = await conn.query(
        sql,
        id
    )

    return res.status(StatusCodes.OK).json(rows);
}

module.exports = {addOrder, getOrders, getOrderDetail};