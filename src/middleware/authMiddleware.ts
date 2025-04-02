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
    res
      .status(401)
      .json({ message: "دسترسی غیرمجاز! لطفا وارد حساب خود شوید" });
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
    res.status(401).json({ message: "توکن نامعتبر است، لطفا مجددا وارد شوید" });
    return;
  }
};
