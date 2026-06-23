import express from "express";
import { createTask, getTasksByConversation, updateTask, deleteTask } from "../controller/task.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Define CRUD routes for tasks
router.post("/", secureRoute, createTask);
router.get("/conversation/:conversationId", secureRoute, getTasksByConversation);
router.patch("/:id", secureRoute, updateTask);
router.delete("/:id", secureRoute, deleteTask);

export default router;
