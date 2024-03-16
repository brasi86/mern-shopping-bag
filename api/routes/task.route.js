import express from "express";
import {
  addTask,
  completeTasks,
  deleteTasks,
  getTasks,
  updateTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/addTask", addTask);
router.get("/getTasks", getTasks);
router.delete("/deleteTasks", deleteTasks);
router.put("/updateTasks", updateTasks);
router.put("/completeTasks/", completeTasks);

export default router;
