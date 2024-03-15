import express from "express";
import {
  deleteUser,
  getUsers,
  logoutUser,
  nucleoUser,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/logout", logoutUser);
router.post("/getUsers", getUsers);
router.post("/update/:nucleoId", verifyToken, nucleoUser);

export default router;
