// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({
      message:
        "Unauthorized Access, Please Sign it and try again!",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET!
    );
    req.user = decoded;
    return next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token, Please sign in again!",
    });
    return;
  }
};
