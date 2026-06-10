import { Prisma, Task } from "@prisma/client";
import prisma from "../../../shared/prisma";

const create = async (data: Prisma.TaskCreateInput): Promise<Task> => {
  return prisma.task.create({ data });
};

const findMany = async (where: Prisma.TaskWhereInput): Promise<Task[]> => {
  return prisma.task.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findById = async (id: string): Promise<Task | null> => {
  return prisma.task.findUnique({
    where: {
      id,
    },
  });
};

const updateById = async (
  id: string,
  data: Prisma.TaskUpdateInput,
): Promise<Task> => {
  return prisma.task.update({
    where: {
      id,
    },
    data,
  });
};

const deleteById = async (id: string): Promise<Task> => {
  return prisma.task.delete({
    where: {
      id,
    },
  });
};

export const TaskRepository = {
  create,
  deleteById,
  findById,
  findMany,
  updateById,
};
