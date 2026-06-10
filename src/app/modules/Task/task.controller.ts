import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.createTask(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTasks(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
    meta: {
      total: result.length,
    },
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateTask(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.deleteTask(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
};
