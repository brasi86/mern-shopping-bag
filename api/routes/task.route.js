import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addTask,
  deleteTasks,
  getTasks,
  updateTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/addTask", verifyToken, addTask);
router.get("/getTasks", getTasks);
router.delete("/deleteTasks/:userId", deleteTasks);
router.put("/updateTasks/:userId", updateTasks);

export default router;
