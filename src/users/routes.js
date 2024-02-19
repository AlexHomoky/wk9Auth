const { Router } = require("express");
const userRouter = Router();

const { signupUser, getAllUsers } = require("./controllers");

userRouter.post("/users/signup", signupUser);
userRouter.get("/users/getAll", getAllUsers);

module.exports = userRouter;
