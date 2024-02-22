const { Router } = require("express");
const userRouter = Router();

const {
  hashPass,
  comparePass,
  emailValidation,
  passwordValidation,
} = require("../middleware/auth");

const { signupUser, getAllUsers, login, getOneUser } = require("./controllers");

userRouter.post("/users/signup", hashPass, signupUser);

userRouter.post("/users/login", comparePass, login);

userRouter.get("/users/getAll", getAllUsers);

userRouter.get("users/getOneUser/:username", getOneUser);

module.exports = userRouter;
