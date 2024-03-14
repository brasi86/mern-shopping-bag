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
router.get("/getTasks", verifyToken, getTasks);
router.delete("/deleteTasks/:userId", verifyToken, deleteTasks);
router.put("/updateTasks/:userId", verifyToken, updateTasks);

export default router;
