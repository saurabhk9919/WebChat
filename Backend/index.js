import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './route/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';//is a type of middleware that can be used to enable CORS with various options.

const app = express();
dotenv.config();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4001',
  credentials: true,
}));

const PORT = process.env.PORT || 5001;
const URI=process.env.MONGO_URI;

const start = async () => {
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});