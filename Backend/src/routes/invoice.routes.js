import express from "express";
import {
  createInvoice,
  getInvoices,
} from "../controllers/invoice.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);

export default router;