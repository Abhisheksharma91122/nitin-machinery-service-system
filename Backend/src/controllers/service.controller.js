import ServiceRequest from "../models/serviceRequest.model.js";


// ✅ Create new service request
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

    // Basic validation
    if (
      !customerName ||
      !contactNumber ||
      !machineName ||
      !address ||
      !problemDescription
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const newRequest = await ServiceRequest.create({
      customerName,
      contactNumber,
      email,
      machineName,
      address,
      problemDescription,
    });

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      data: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Get all service requests (Admin)
export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ Get single request by ID
export const getServiceRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

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
    );

    res.json(updated);
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
    const customers = await ServiceRequest.distinct("email");

    res.json({
      totalOrders,
      pendingOrders,
      inProgress,
      completed,
      totalCustomers: customers.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await ServiceRequest.aggregate([
      {
        $group: {
          _id: "$email",
          name: { $first: "$customerName" },
          contact: { $first: "$contactNumber" },
          email: { $first: "$email" },
          address: { $first: "$address" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          contact: 1,
          email: 1,
          address: 1,
        },
      },
    ]);

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

    const history = await ServiceRequest.find({ email }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};