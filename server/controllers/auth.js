import mongoose from "mongoose";
import crypto from "crypto";
import User from "../models/Users.js";
import ErrorResponse from "../utils/errorResponse.js";
import sendEmail from "../utils/SendEmail.js";

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

export const ForgotPassword = async (req, res, next) => {
  // res.send("forgotPassworRoute");
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent.", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    const message = `
    <h1> You Have Requested a Password Reset.</h1>
    <p>Please go to this link to reset your password</P>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    try {
      await sendEmail({
        to: user.email,
        subject: `Password Reset Request for ${user.username}`,
        text: message,
      });

      res.status(200).json({ success: true, data: "email sent." });
    } catch (error) {
      user.getResetPasswordToken = undefined;
      user.getResetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() },
    });

    if (!user) {
      next(new ErrorResponse("Invalid reset token.", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();
    res.status(201).json({ success: true, data: "Password reset success." });
  } catch (error) {}
};

const sendToken = (user, statusCode, res) => {
  const token = user.getToken();
  res.status(statusCode).json({ sucess: true, token });
};
