const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../users/model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const hashPass = async (req, res, next) => {
  try {
    console.log("req.body.password before hash: ", req.body.password);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    req.body.password = hashedPassword;
    console.log("req.body.password after hash: ", req.body.password);
    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    //compare passwords.. we need plain text password from req body
    //and hashed password from db - by finding the user by username sent in the request body
    const plainTextPass = req.body.password;

    const user = await User.findOne({
      where: { username: req.body.username },
    });

    const hashedDb = user.dataValues.password;

    // console.log(hashedDb);

    const matched = await bcrypt.compare(plainTextPass, hashedDb);

    if (!matched) {
      res.status(401).json({ message: "invalid login" });
    }

    const userData = user.dataValues;

    // res.send({ message: "returned user data", userData });

    req.user = user.dataValues;

    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const emailValidation = async (req, res, next) => {
  // validate email
  next();
};

const passwordValidation = async (req, res, next) => {
  // validate password
  next();
};

const tokenCheck = async (req, res, next) => {
  try {
    console.log(req.header("Authorization"));
    // 1. check req header - does auth exist

    if (!req.header("Authorization")) {
      throw new Error("No token passed");
    }
    //2. get the JWT from header

    const token = req.header("Authorization").replace("Bearer ", "");

    // 3. decode the token using secret

    const decodedToken = await jwt.verify(token, process.env.SECRET);

    //4. get user with ID

    const user = await User.findOne({ where: { id: decodedToken.id } });
    //5. if !user send 401 res

    if (!user) {
      res.status(401).json({ message: "not authorized" });
    }
    //6. pass on user data to login func

    req.authCheck = user;
    next();

    res.send({ decodedToken: decodedToken });
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
  tokenCheck: tokenCheck,
  emailValidation: emailValidation,
  passwordValidation: passwordValidation,
};
