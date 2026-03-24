import Invoice from "../models/invoice.model.js";

export const createInvoice = async (req, res) => {
  try {
    const { orderId, customerName, amount } = req.body;

    const invoice = await Invoice.create({
      orderId,
      customerName,
      amount,
    });

    res.status(201).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};