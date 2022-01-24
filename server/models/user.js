const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
});
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) user.password = await bcrypt.hash(user.password, 8);
	next();
});
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("Unable to login");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Unable to login");
	return user;
};
userSchema.statics.findByToken = async (token) => {
	return await User.findOne({ "tokens.token": token });
};
userSchema.methods.generateToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "thisisatestsecret", { expiresIn: "1 days" });
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
