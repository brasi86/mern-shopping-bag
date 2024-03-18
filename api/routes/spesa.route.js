import express from "express";
import { addSpesa, getSpese } from "../controllers/spesa.controller.js";

const router = express.Router();

router.post("/addSpesa", addSpesa);
router.get("/getSpese", getSpese);

export default router;
