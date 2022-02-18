import mongoose from "mongoose";
import User from "../models/Users.js";
import ErrorResponse from "../utils/errorResponse.js";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse("Please provide an email and password.", 400)
    );
  }
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid Credentials.", 401));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid Credentials.", 401));
    }
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const ForgotPassword = (req, res, next) => {
  res.send("ForgotPasswordRoute");
};

export const resetPassword = (req, res, next) => {
  res.send("ResetPassworRoute");
};

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  res.status(statusCode).json({ sucess: true, token });
};
