import express from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = express.Router();

router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTaskById);
router.post("/", validateRequest(TaskValidation.create), TaskController.createTask);
router.patch("/:id", validateRequest(TaskValidation.update), TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

export const TaskRoutes = router;
