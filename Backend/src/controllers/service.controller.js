import ServiceRequest from "../models/serviceRequest.model.js";
import Customer from "../models/customer.model.js";
import Notification from "../models/notification.model.js";
import { io } from "../app.js";

export const createServiceRequest = async (req, res) => {
  try {
    const {
      customerName,
      contactNumber,
      email,
      machineName,
      address,
      problemDescription,
    } = req.body;

    // Validation
    if (
      !customerName ||
      !contactNumber ||
      !email ||
      !machineName ||
      !address ||
      !problemDescription
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // 🔍 Check existing customer
    let customer = await Customer.findOne({ email });

    // 🆕 Create or update customer
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        contactNumber,
        email,
        address,
      });
    } else {
      customer.name = customerName;
      customer.contactNumber = contactNumber;
      customer.address = address;
      await customer.save();
    }

    // 🛠️ Create service request
    const serviceRequest = await ServiceRequest.create({
      customer: customer._id,
      machineName,
      problemDescription,
    });

    // create notification
    const notification = await Notification.create({
      user: serviceRequest.customer,
      serviceRequest: serviceRequest._id,
      message: "New service request created",
    });

    // Populate and emit to all connected admin clients
    const populated = await Notification.findById(notification._id)
      .populate("user", "name email contactNumber address")
      .populate("serviceRequest", "machineName problemDescription status");

    io.emit("new_notification", populated); // broadcast to all connected sockets

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Service Requests (with customer details)
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("customer", "name email contactNumber address")
      .sort({ createdAt: -1 }); // 👈 newest first

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    let { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    status = status.toLowerCase().trim();

    const allowedStatus = ["pending", "in progress", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    ).populate("customer", "name email");

    if (!updated) {
      return res.status(404).json({
        message: "Service request not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await ServiceRequest.countDocuments();

    const pendingOrders = await ServiceRequest.countDocuments({
      status: "pending",
    });

    const inProgress = await ServiceRequest.countDocuments({
      status: "in progress",
    });

    const completed = await ServiceRequest.countDocuments({
      status: "completed",
    });

    // Optional: unique customers count
    const totalCustomers = await Customer.countDocuments();

    res.json({
      totalOrders,
      pendingOrders,
      inProgress,
      completed,
      totalCustomers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ isActive: true });

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomerHistory = async (req, res) => {
  try {
    const { email } = req.params;

    // 🔍 Find customer first
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // 📜 Get all requests for that customer
    const history = await ServiceRequest.find({
      customer: customer._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate Customer
export const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // 🔄 Toggle active/inactive
    customer.isActive = !customer.isActive;
    await customer.save();

    res.json({
      success: true,
      message: `Customer ${
        customer.isActive ? "Activated" : "Deactivated"
      } successfully`,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all service request which is unread
export const getUnreadServiceRequests = async (req, res) => {
  try {
    const unreadRequests = await Notification.find({ isRead: false })
      .populate("user", "name email contactNumber address")
      .populate("serviceRequest", "machineName problemDescription status")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: unreadRequests.length,
      data: unreadRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// mark notification as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isRead: false },
      { $set: { isRead: true } },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE Service Request
export const deleteServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if request exists
    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    // Delete related notifications (important)
    await Notification.deleteMany({ serviceRequest: id });

    // Delete service request
    await ServiceRequest.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Service request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service request -" + error.message,
    });
  }
};
