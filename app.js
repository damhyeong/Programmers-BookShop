const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");
const bookRouter = require("./routes/books");
const cartRouter = require("./routes/carts");
const likeRouter = require("./routes/likes");
const categoryRouter = require("./routes/category");

app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/carts", cartRouter);
app.use("/likes", likeRouter);

