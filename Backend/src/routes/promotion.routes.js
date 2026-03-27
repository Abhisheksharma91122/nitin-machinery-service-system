import express from "express";
import { sendPromotion, getPromotions } from "../controllers/promotion.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendPromotion);
router.get("/", protect, getPromotions);

export default router;