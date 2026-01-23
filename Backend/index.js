import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './route/user.route.js';

const app = express();
dotenv.config();

app.use(express.json())

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

app.use("/users", userRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});