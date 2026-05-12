import { Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4001",
    credentials: true,
    methods: ["GET", "POST"],
  },
});
//function for real time messaging
export const getRecieverSocketId = (receiverId) => {
  return users[receiverId];
};

const users = {};
io.on("connection", (socket) => {
  console.log("a user connected :", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("User connected with ID:", userId); 
  }

  io.emit("getonlineusers", Object.keys(users));

socket.on("disconnect", () => {
  console.log("user disconnected :", socket.id);
  delete users[userId];
  io.emit("getonlineusers", Object.keys(users));
});
});
export {io,app,server};