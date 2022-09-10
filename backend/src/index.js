require("colors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./database");

const chatRouter = require("./routers/chat.router");
const userRouter = require("./routers/user.router");
const messageRouter = require("./routers/message.router");

const app = express();
connection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log("Server running at port ".brightYellow + port.brightYellow)
);
