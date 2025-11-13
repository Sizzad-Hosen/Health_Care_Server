import { NextFunction, Request, Response } from "express";
import config from "../config";
import httpStatus from "http-status";
import { verifyToken } from "../../helpars/jwtHelpers";
import ApiError from "../errors/ApiError";

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
     throw new ApiError(httpStatus.FORBIDDEN, "Your are not authorize!!")
      }

      const token = authHeader.split(" ")[1];

      const decodedToken = await verifyToken(token, config.jwt.jwt_secret as string);

      if (roles.length && !roles.includes(decodedToken.role)) {
     throw new ApiError(httpStatus.FORBIDDEN, "Your are not authorize!!")
      }

      // attach user info to request (optional)
      req.user = decodedToken;

      next();
    } catch (error: any) {
     
        throw new ApiError(httpStatus.FORBIDDEN,"Invalid or expired token")
    
  };

}

export default auth

