const User = require("../models/userModel");
const Message = require('../models/messageModel');

const { generateToken } = require("../utils/token");

const getUserChats = async (req, res) => {
    try{
       const user = req.user._id;
       const users = await User.find({_id:{$ne : user}});

       res.status(200).json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const register = async (req, res) => {
    try{
		const { fullName, username, password, confirmPassword, gender } = req.body;

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const user = new User({
            fullName,
			username,
			password,
			gender,
			profilePic: gender === "male" ? boyProfilePic : girlProfilePic,

        });
        await user.save();
        const token = await generateToken(user);
        res.cookie("jwt", token, { 
            httpOnly: true ,
            secure : true,
            maxAge: 30*24*60*60*1000,
            sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    
        });
        res.status(201).json({
            _id: user._id,
			fullName: user.fullName,
			username: user.username
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const login = async (req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "Invalid username or password"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid username or password"});
        }
        const token = await generateToken(user);
        res.cookie("jwt", token, { 
            httpOnly: true ,
            secure : true,
            maxAge: 30*24*60*60*1000    
        });
        res.status(200).json({
            _id: user._id,
			fullName: user.fullName,
			username: user.username,});
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const logout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({message: "Logged Out Successfully"});
};
module.exports = { register, login,logout ,getUserChats };