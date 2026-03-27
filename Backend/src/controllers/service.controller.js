import ServiceRequest from "../models/serviceRequest.model.js";
import Customer from "../models/customer.js";


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


// ✅ Get All Service Requests (with customer details)
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("customer", "name email contactNumber address");

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get single request by ID
export const getServiceRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("customer", "name email contactNumber address");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
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


// ✅ Delete service request
export const deleteServiceRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
      status: "in-progress",
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
    const customers = await Customer.find();

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