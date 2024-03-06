const mongoose = require("mongoose");
const bcrypt = require("bcrypt");   

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function (){
    const user = this.toObject();
    delete user.password;
    delete user.__v;
    return user;
};

module.exports = mongoose.model("User", userSchema);

