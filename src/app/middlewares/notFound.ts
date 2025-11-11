import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API endpoint not found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "The requested route does not exist",
      },
    ],
  });
};
