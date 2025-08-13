import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: string; // user id
  role?: string;
}

export const AuthGuard = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  // Allow public routes without auth
  if (req.path === "/user/login" || req.path === "/user/signup") {
    return next();
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    return res
      .status(500)
      .json({ message: "Server error: Missing secret key" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const payload = decoded as JwtPayload & {
      id?: string;
      role?: { roleName: string };
    };

    if (!payload.id || !payload.role?.roleName) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = payload.id;
    req.role = payload.role.roleName;

    next();
  });
};
