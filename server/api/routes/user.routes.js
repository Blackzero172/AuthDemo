const express = require("express");
const auth = require("../../middleware/auth");
const {
	getUsers,
	getUser,
	postUser,
	doAction,
	removeUser,
	login,
	logout,
	updateUser,
} = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.get("/users/:id", auth, getUser);
userRouter.get("/users", auth, getUsers);
userRouter.post("/users/signup", postUser);
userRouter.post("/users/login", login);
userRouter.post("/users/logout", auth, logout);
userRouter.put("/users/:action/:id", auth, doAction);
userRouter.put("/users/edit", updateUser);
userRouter.delete("/users/:id", auth, removeUser);

module.exports = userRouter;
