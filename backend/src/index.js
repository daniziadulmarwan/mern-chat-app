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
const server = app.listen(port, () =>
  console.log("Server running at port ".brightYellow + port.brightYellow)
);

const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5173" },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io".brightGreen);

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat users not defined");
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
});
