import { Prisma, Task } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { ITask, ITaskFilterRequest } from "./task.interface";
import { TaskRepository } from "./task.repository";

const toTaskData = (payload: ITask): Prisma.TaskCreateInput => ({
  title: payload.title,
  description: payload.description,
  status: payload.status ?? "pending",
  priority: payload.priority ?? "medium",
  dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
});

const toTaskUpdateData = (payload: Partial<ITask>): Prisma.TaskUpdateInput => ({
  title: payload.title,
  description: payload.description,
  status: payload.status,
  priority: payload.priority,
  dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
});

const createTask = async (payload: ITask): Promise<Task> => {
  return TaskRepository.create(toTaskData(payload));
};

const getTasks = async (filters: ITaskFilterRequest): Promise<Task[]> => {
  const where: Prisma.TaskWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  return TaskRepository.findMany(where);
};

const getTaskById = async (id: string): Promise<Task> => {
  const result = await TaskRepository.findById(id);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Task not found");
  }

  return result;
};

const updateTask = async (id: string, payload: Partial<ITask>): Promise<Task> => {
  await getTaskById(id);
  return TaskRepository.updateById(id, toTaskUpdateData(payload));
};

const deleteTask = async (id: string): Promise<Task> => {
  await getTaskById(id);
  return TaskRepository.deleteById(id);
};

export const TaskService = {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
};
