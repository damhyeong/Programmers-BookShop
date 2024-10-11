const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const addToCart = (req, res) => {
    const {book_id, quantity, user_id} = req.body;

    const sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)"
    const values = [book_id, quantity, user_id];

    conn.query(
        sql,
        values,
        (err, results, fields) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
}

const getCartItems = (req, res) => {
    const {user_id, isSelectedArr} = req.body;

    let sql = `SELECT 
                     cartItems.id, book_id, title, summary, quantity, price  FROM cartItems 
                    LEFT JOIN books ON cartItems.book_id = books.id 
                    WHERE user_id = ?`;

    if(isSelectedArr){
        sql += " AND cartItems.id IN (";

        isSelectedArr.forEach((value, index) => {
            if(index !== isSelectedArr.length - 1){
                sql += value.toString() + ", ";
            } else {
                sql += value.toString()
            }
        })

        sql += ")"
    }

    const values = [user_id];

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            if(results){
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    )
}

const removeCartItems = (req, res) => {
    let {id} = req.params;

    id = parseInt(id);

    const sql = "DELETE FROM cartItems WHERE id = ?"
    const values = [id];

    conn.query(
        sql,
        values,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
            }

            if(results.affectedRows !== 0){
                return res.status(StatusCodes.OK).end();
            } else {
                return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    message : "현재 장바구니에 없는 상품입니다."
                });
            }
        }
    )

}


module.exports = {addToCart, getCartItems, removeCartItems};