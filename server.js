const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const UserManager = require("./userManager/UserManager");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  userManager.addUser("nothing", socket);
  // console.log(first)
  //   users.push(socket.id);
  socket.on("disconnect", () => {
    userManager.removeUser(socket);
    console.log("user disconnected");
  });

  socket.on("offer", (sdp) => {
    socket.emit("offer", { sdp, ID: socket.id });
    console.log(sdp, "ID", socket.id);
  });

  socket.on("create", (data) => {
    console.log(socket.id);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
