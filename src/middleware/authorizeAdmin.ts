import { Request, Response, NextFunction } from "express";

// This middleware checks if the authenticated user has the ADMIN role.
export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // We assume the `authenticateUser` middleware has already run and attached the user to the request.
  const user = (req as any).user;

  if (user && user.role === "ADMIN") {
    // If the user is an admin, proceed to the next handler.
    next();
  } else {
    // If not, return a 403 Forbidden error.
    res.status(403).json({
      success: false,
      message:
        "Access denied. You do not have permission to perform this action.",
    });
  }
};
