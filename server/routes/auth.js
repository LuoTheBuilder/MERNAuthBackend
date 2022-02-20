import express from "express";
import {
  register,
  login,
  ForgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", ForgotPassword);
router.put("/resetPassword/:resetToken", resetPassword);

export default router;
