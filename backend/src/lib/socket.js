import {Server} from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";


const app = express();
const server = http.createServer(app);

// Allow WebSocket connections from local dev and production frontend (via FRONTEND_URL env)
const allowedSocketOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean)

const io = new Server(server, {
  cors: {
    origin: allowedSocketOrigins,
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storing online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName ,  socket.userId);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };