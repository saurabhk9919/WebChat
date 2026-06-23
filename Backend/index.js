import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './route/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';//is a type of middleware that can be used to enable CORS with various options.
import messaRoute from './route/message.route.js';
import taskRoute from './route/task.route.js';
import {app,server} from './SocketIO/server.js';

dotenv.config();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4001',
  credentials: true,
}));

app.get("/", (_req, res) => {
  res.status(200).send("WebChat API is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 5001;
const URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const start = async () => {
  if (!URI) {
    console.warn("No MongoDB URI configured. Set MONGO_URI to a hosted MongoDB connection string before deploying.");
    return;
  }

  try{
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  }
  catch(err){
    console.log("Error in DB connection", err);
  }
}

start();

app.use("/api/users", userRoute);
app.use("/api/messages", messaRoute);
app.use("/api/tasks", taskRoute);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});