import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserServices.createAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserServices.createDoctor(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});

const createPatient = catchAsync(async (req: Request, res: Response) => {

    const result = await UserServices.createPatient(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created successfuly!",
        data: result
    })
});


export const UserControllers = { createAdmin , createDoctor, createPatient};
