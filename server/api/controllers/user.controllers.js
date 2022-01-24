const express = require("express");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { getData, addUser, deleteUser, withdraw, deposit, setCredit, transfer } = require("./utils/utils");
const app = express();
app.use(express.json());

const getUsers = async (req, res) => {
	try {
		const users = await getData();
		if (!users[0]) {
			return res.status(404).send("No users found");
		}
		res.send(users);
	} catch (e) {
		res.status(500).send(e.message);
		console.log(e);
	}
};
const getUser = async (req, res) => {
	try {
		const user = await getData(req.params.id);
		if (!user) {
			return res.status(404).send("No users found");
		}
		res.send(user);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const postUser = async (req, res) => {
	try {
		const user = await addUser(req.body);
		const genToken = await user.generateToken();
		res.status(201).send({ user, genToken });
	} catch (e) {
		if (e.message.includes("E11000")) return res.status(400).send("User already exists");
		res.status(500).send(e.message);
	}
};
const removeUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await deleteUser(id);
		if (!user) {
			return res.status(404).send("No users found");
		}
		res.send(user);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const doAction = async (req, res) => {
	const { id, action } = req.params;
	const amount = req.body.amount;
	let actionFunction;
	switch (action) {
		case "withdraw":
			actionFunction = withdraw;
			break;
		case "deposit":
			actionFunction = deposit;
			break;
		case "transfer":
			actionFunction = transfer;
			break;
		case "credit":
			actionFunction = setCredit;
			break;
	}

	try {
		const targetID = req.body.targetID;
		let users = [];
		if (!targetID) {
			users = await actionFunction(id, amount);
		} else {
			users = await actionFunction(id, targetID, amount);
		}
		res.send(users);
	} catch (e) {
		if (e.message.includes("validation") || e.message.includes("Not")) return res.status(400).send(e.message);
		else if (e.message.includes("null")) return res.status(404).send("User not found");
		res.status(500).send(e.message);
	}
};
const updateUser = async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	user.password = req.body.password;
	await user.save();
	res.send(user);
};
const login = async (req, res) => {
	const { email, password, token } = req.body;
	let user;
	try {
		if (token) {
			if (jwt.verify(token, "thisisatestsecret")) {
				user = await User.findByToken(token);
				if (!user) throw new Error("Token has expired");
				return res.send({ message: "Logged in!", user, genToken: token });
			} else {
				throw new Error("Token has expired");
			}
		}
		user = await User.findByCredentials(email, password);
		const genToken = await user.generateToken();
		res.send({ message: "Logged in!", user, genToken: genToken });
	} catch (e) {
		if (e.message.includes("expired")) {
			const user = await User.findByToken(token);
			if (user) {
				user.tokens = user.tokens.filter((token) => {
					token.token !== token;
				});
				await user.save();
			}
		}
		res.status(400).send(e.message);
	}
};
const logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
		await req.user.save();
		res.send("Logged out!");
	} catch (e) {
		res.status(500).send(e.message);
	}
};
module.exports = { getUsers, getUser, postUser, doAction, removeUser, login, logout, updateUser };
