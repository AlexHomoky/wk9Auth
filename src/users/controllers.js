const User = require("./model");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(201).json({ message: "user added", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(201).json({ message: "all the users...", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const login = async (req, res) => {
  try {
    // https://www.npmjs.com/package/jsonwebtoken

    const token = await jwt.sign({ id: req.user.id }, process.env.SECRET);

    console.log(token);

    const user = {
      id: req.user.id,
      username: req.user.username,
      token: token,
    };

    // const userInfo = [User.dataValues.username, req.user.id];
    // res.send({ message: "Welcome !", userInfo: userInfo });

    // user id, username, NOT PASSWORD, NOT EMAIL
    res.status(201).json({ message: "login success", user: user });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};

const getOneUser = async (req, res) => {
  res.status(201).json({ message: "login success", user: req.user });
};

module.exports = {
  signupUser: signupUser,
  getAllUsers: getAllUsers,
  login: login,
  getOneUser: getOneUser,
};
