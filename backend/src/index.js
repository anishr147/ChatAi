import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path"
import { connectDB } from "./lib/db.js";

import{app , server} from './lib/socket.js'
import cors from 'cors'

dotenv.config();



const __dirname = path.resolve();

const PORT = process.env.PORT || 6000;

app.set("trust proxy", true) // for secure cookies behind proxies
app.use(express.json({ limit: "10mb"})) // req.body
app.use(express.urlencoded({  limit: "10mb", extended: true }))
app.use(cookieParser()) // req.cookies
// Allow CORS from local dev and from a production frontend URL provided
// via the FRONTEND_URL environment variable (set this in Railway).
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean)
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

import authRoutes from "./routes/auth.route.js"
app.use("/api/auth", authRoutes)


import messageRoutes from "./routes/message.route.js"
app.use("/api/messages", messageRoutes)


// make ready for deployement
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../fronted/dist")))
// here this code help to connect fronted  and backend
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../fronted", "dist", "index.html"));
  });
}


server.listen(PORT, () => {
  console.log("Server is running on port:" , PORT);
  connectDB()
});
