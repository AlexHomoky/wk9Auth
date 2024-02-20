require("dotenv").config();
const express = require("express");

const User = require("./users/model");

const userRouter = require("./users/routes");

const port = process.env.PORT || 5001;

const app = express();

app.use(express.json());

app.use(userRouter);

//==================== middleware example ==================

const dave = async (...args) => {};

const sendRes = async (req, res) => {
  res.send({ data: req.body });
};

const justReq = async (req) => {
  console.log(req.body);
};

const firstFunc = async (req, res, next) => {
  req.body.first = "one";

  next();
};

const secondFunc = async (req, res, next) => {
  req.body.second = "two";

  next();
};

app.post("/middlewareexample", firstFunc, secondFunc, sendRes);

//==========================================================

const syncTables = () => {
  User.sync();
};

app.listen(port, () => {
  syncTables();
  console.log(`Server is listening on port ${port}`);
});
