import express from "express";
import { addSpesa } from "../controllers/spesa.controller.js";

const router = express.Router();

router.post("/addSpesa", addSpesa);

export default router;
