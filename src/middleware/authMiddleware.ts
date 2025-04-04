// src/middleware/authMiddleware.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../types/express";
dotenv.config();

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message:
        "Unauthorized Access, Please Sign it and try again!",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };
    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token, Please sign in again!",
    });
    return;
  }
};
