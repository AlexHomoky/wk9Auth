const bcrypt = require("bcrypt");

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

    console.log(hashedDb);

    const matched = await bcrypt.compare(plainTextPass, hashedDb);

    if (!matched) {
      res.status(401).json({ message: "invalid login" });
    }

    const userData = user.dataValues;

    res.send({ message: "returned user data", userData });

    // req.user = user.dataValues

    // next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const getOneUser = async (req, res) => {
  res.status(201).json({ message: "login success", user: req.user });
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
};
