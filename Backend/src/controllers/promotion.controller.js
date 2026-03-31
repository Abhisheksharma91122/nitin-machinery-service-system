import Promotion from "../models/promotion.model.js";
import Customer from "../models/customer.model.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

console.log("Email User:", process.env.EMAIL_USER); // Should show your email
console.log("Email Pass exists:", process.env.EMAIL_PASS); // Should show true

// Configure nodemailer — update with your SMTP credentials in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPromotion = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required" });
    }

    // Get all customers
    const customers = await Customer.find({}, "email name");

    if (!customers.length) {
      return res.status(400).json({ message: "No customers found to send emails to" });
    }

    // Save campaign to DB first with "sending" status
    const promotion = await Promotion.create({
      subject,
      content,
      recipients: customers.length,
      status: "sending",
    });

    // Send emails
    const emailPromises = customers.map((customer) => {
      const personalizedContent = content.replace(/\${customer\.name}/g, customer.name);
      return transporter.sendMail({
        from: `"Service Team" <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject,
        html: `<p>Hi ${customer.name},</p>${personalizedContent}`,
      }).catch(err => {
        console.error(`Failed to send to ${customer.email}:`, err);
        throw err;
      })
    }
    );

    await Promise.allSettled(emailPromises);

    // Mark as completed
    promotion.status = "completed";
    await promotion.save();

    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};