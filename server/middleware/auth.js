import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import ErrorResponse from "../utils/errorResponse.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.statsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ");
  }

  if (!token) {
    return next(new ErrorResponse("Not Authorized to access this route.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No user found with this id.", 404));
    }
    req.user = user;

    next();
  } catch (error) {
    return next(ErrorResponse("Not authorized to access this route.", 401));
  }
};
