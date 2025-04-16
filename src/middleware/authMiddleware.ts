import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
export const authenticateUser: RequestHandler = (
  req,
  res,
  next
): Promise<void> | void => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({
      message: "Access denied. No token provided.",
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined.");
    }

    const decoded = jwt.verify(token, secret) as {
      id: string;
      role: string;
    };

    // اضافه کردن به req با cast کردن
    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
    return;
  }
};
