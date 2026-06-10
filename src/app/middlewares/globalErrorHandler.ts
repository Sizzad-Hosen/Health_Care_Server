
import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import ApiError from "../errors/ApiError";
import config from "../config";

type ErrorResponse = {
    success: false;
    message: string;
    error?: unknown;
    stack?: string;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let error: unknown = config.env === "production" ? undefined : err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = 'Validation Error';
        error = err.message;
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = httpStatus.CONFLICT;
            message = "Duplicate Key error";
            error = err.meta;
        }
    }
    else if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        error = err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        error = config.env === "production" ? undefined : err.message;
    }
    else if (err instanceof Error) {
        message = err.message || message;
    }

    const response: ErrorResponse = {
        success: false,
        message,
        error,
    };

    if (config.env !== "production" && err instanceof Error) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default globalErrorHandler;
