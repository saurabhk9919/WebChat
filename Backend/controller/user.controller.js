import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createTokenandSaveCookie } from "../jwt/generateToken.js";

//signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    createTokenandSaveCookie(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log("Error in user signup", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid user or password" });
    }

    createTokenandSaveCookie(user._id, res);

    res.status(200).json({
      message: "User Logged in successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Error in user login", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//logout
export const logout = (req, res)=>{
  try{

  res.clearCookie("jwt");
  res.status(200).json({message: "User logged out successfully"});
  }
  catch(err){
    console.log("Error in user logout", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get user profile from database
export const getUserProfile = async (req, res) => {
  try{
    const loggedInUser = req.user._id; // set by secureRoute
    const filteredUsers = await User.find({_id: { $ne: loggedInUser }}).select("-password");
    res.status(200).json(filteredUsers);

  }
  catch(err){
    console.log("Error in getting user profile", err);
    res.status(500).json({ message: "Internal Server Error" });

  }
}