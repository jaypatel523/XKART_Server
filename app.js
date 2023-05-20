require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/connect");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const wishlistRoutes = require("./routes/wishlist");
const conversationRoutes = require("./routes/conversation");
const chatRoutes = require("./routes/chat");

const { Server } = require("socket.io");
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// const path = require('path');
// app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/api/", userRoutes);
app.use("/api/", productRoutes);
app.use("/api/", wishlistRoutes);
app.use("/api/", conversationRoutes);
app.use("/api/", chatRoutes);

// start the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    httpServer.listen(process.env.PORT, () =>
      console.log(`server is listening on port : ${process.env.PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  // console.log('connected to socket server...');


  socket.on("startConversation", (userId) => {
    io.emit("startConversation", userId);
  })



  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // console.log("send message is working");
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", { senderId, text });
  });

  // when disconnect
  socket.on("disconnect", () => {
    // console.log('user disconnected...')
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

start();

