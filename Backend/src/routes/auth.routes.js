import express from "express";
import { loginAdmin } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/verify-token", protect, (req, res) => {
  res.status(200).json({ message: "Token valid", user: req.user });
});

export default router;