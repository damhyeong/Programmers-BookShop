const conn = require("../mariadb");
const {StatusCodes} = require("http-status-codes");

const allBooks = (req, res) => {

    const {categoryId, news, limit, currentPage} = req.query;

    const offset = parseInt(limit) * (parseInt(currentPage) - 1);

    let sql = "SELECT * FROM books";
    let values = [];

    if(categoryId && news){
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [categoryId];
    } else if (categoryId){
        sql += " WHERE category_id = ?";
        values = [categoryId];
    } else if(news){
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);

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

const bookDetail = (req, res) => {
    let {bookId} = req.params;
    let {userId} = req.body;

    bookId = parseInt(bookId);

    const sql = `SELECT *,
                    (SELECT EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?)) AS liked
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id = ?`

    const value = [userId, bookId, bookId];

    conn.query(
        sql,
        value,
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const book = results[0];

            if(book){
                return res.status(StatusCodes.OK).json(book);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    )
}


module.exports = {allBooks, bookDetail};