import express from "express";
import { createInvoice, getInvoices, updateInvoiceStatus } from "../controllers/invoice.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getInvoices);
router.put("/:id", protect, updateInvoiceStatus);

export default router;