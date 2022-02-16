import mongoose from "mongoose";
import User from "../models/Users.js";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    res.status(201).json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ sucess: false, error: "Please provide email and password." });
  }
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(404).json({ sucess: false, error: "Invalid Credentials" });
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      res.status(404).json({ success: false, error: "Invalid Credentials" });
    }
    res.status(200).json({
      success: true,
      token: "adasdgfe",
    });
  } catch (error) {
    res.status({ success: false, error: error.message });
  }
};

export const ForgotPassword = (req, res, next) => {
  res.send("ForgotPasswordRoute");
};

export const resetPassword = (req, res, next) => {
  res.send("ResetPassworRoute");
};
