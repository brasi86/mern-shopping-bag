import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  addTask,
  deleteTasks,
  getTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/addTask", verifyToken, addTask);
router.get("/getTasks", getTasks);
router.delete("/deleteTasks", deleteTasks);

export default router;
