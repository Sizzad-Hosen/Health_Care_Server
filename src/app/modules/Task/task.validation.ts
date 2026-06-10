import { z } from "zod";

const taskBody = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional(),
});

const create = z.object({
  body: taskBody,
});

const update = z.object({
  body: taskBody.partial(),
});

export const TaskValidation = {
  create,
  update,
};
