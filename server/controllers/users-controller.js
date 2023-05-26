const HttpError = require("../models/http-error");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const getUsers = async (req, res, next) => {};

const signUp = async (req, res, next) => {
  const { name, lastName, email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }

  if (hasUser) {
    return next(
      new HttpError("Could not create user, email already exists", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Password encryption failed", 500));
  }


  const createdUser = new User({
    name,
    lastName,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Error while creating a new user, try again please", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.TOKEN_STRING,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Error with token authentication", 500));
  }

  res.status(201);
  res.json({ userId: createdUser.id, email: createdUser.email, token: token});
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;

    let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed, please try again later", 500)
    );
  }

  if (!identifiedUser) {
    return next(new HttpError("Could not find the user", 401));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (error) {
    return next(new HttpError("Error while decrypting the hasehd password", 500));
  }

  if (isValidPassword === false) {
    return next(new HttpError("Incorrect password", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.TOKEN_STRING,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Error with token authentication", 500));
  }

  res.status(201);
  res.json({ userId: identifiedUser.id , token: token});
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
