import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import config from "../config";

interface IAuthUser {
  id: string;
  email: string;
  role: string;
}

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: IAuthUser }, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const token = authHeader.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, config.jwt.jwt_secret as Secret) as IAuthUser;

      if (!decoded) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or malformed token!");
      }

      req.user = decoded;

      // Role-based access control
      if (roles.length && !roles.includes(decoded.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      next();
    } catch (err: any) {
      if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return next(new ApiError(httpStatus.UNAUTHORIZED, err.message));
      }
      next(err);
    }
  };
};

export default auth;
