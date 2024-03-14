import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addTask, getTasks } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/addTask", verifyToken, addTask);
router.get("/getTasks", getTasks);

export default router;
