import express from "express";
import userRoutes from "./user.routes.js";
import serviceRoute from "./service.routes.js";
import authRoutes from "./auth.routes.js";
import invoiceRoutes from "./invoice.routes.js";
import promotionRoutes from "./promotion.routes.js"

const router = express.Router();

router.use("/users", userRoutes);
router.use("/service", serviceRoute);
router.use("/auth", authRoutes);
router.use("/invoice", invoiceRoutes);
router.use("/promotions", promotionRoutes)

export default router;