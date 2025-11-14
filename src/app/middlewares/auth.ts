import { NextFunction, Request, Response } from "express";

import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";
import { verifyToken } from "../../helpars/jwtHelpers";
import config from "../config";


const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            // const token = req.headers.authorization
            
            // if (!token) {
              //     throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
              // }
              
              const authHeader = req.headers.authorization;
              
              if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
              }
              
              const token = authHeader.split(" ")[1];  // <-- FIXED
              
               console.log('tokern', token)
               
                           console.log("🔹 AUTH TOKEN:", req.header("authorization"));
                           console.log("🔹 AUTH ACCESS SECRET:", config.jwt.jwt_secret);


            const verifiedUser = await verifyToken(token, config.jwt.jwt_secret as Secret)

             console.log('verifytoekn', verifiedUser)


            req.user = verifiedUser;





            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;