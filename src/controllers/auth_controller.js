import { generateToken } from "../lib/utils.js";
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({ message: "Email or Username already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user" });
        }
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const{email,password}= req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const passCorrect = await bcrypt.compare(password,user.password)
        if(!passCorrect){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            usesrname:user.username,
            email:user.email,
            profilePic:user.profilePic,
        })
    }catch(error){
        console.log("Error in login controller",error.message)
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller",error.message)
        res.status(500).json({ message: "Internal Server Error" });
        
    }
};
