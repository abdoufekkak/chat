const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connect = require("./db.js");
const register = require("./router/userRouter.js");
const messages = require("./router/messageRoute.js");
const socket = require("socket.io");

const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", register);
app.use("/api/messages", messages);

const server = app.listen(process.env.PORT, () => {
  console.log("SERVERV started");
});

const io = socket(server, {
  cors: {
    origin: "https://legendary-arithmetic-f1f2cd.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log(userId);
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
