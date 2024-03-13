import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { addTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/addTask", verifyToken, addTask);

export default router;
