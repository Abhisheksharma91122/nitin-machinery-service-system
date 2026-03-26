import express from "express";
import {
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceStatus,
  deleteServiceRequest,
  getDashboardStats,
  getAllCustomers,
  getCustomerHistory,
} from "../controllers/service.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", createServiceRequest);
router.get("/customers", protect, getAllCustomers);
router.get("/stats", protect, getDashboardStats);
router.get("/customer-history/:email", protect, getCustomerHistory);
router.get("/", protect, getAllServiceRequests);
router.put("/:id", protect, updateServiceStatus);
// router.get("/:id", getServiceRequestById);
// router.delete("/:id", deleteServiceRequest);

export default router;