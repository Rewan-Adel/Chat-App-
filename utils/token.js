const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const generateToken = async(user)=>{
    const token = jwt.sign({ userId : user._id}, process.env.SECRET_KEY, {expiresIn: "30d"});
    return token;
}

const tokenValidate = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.SECRET_KEY);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
module.exports = {generateToken, tokenValidate};