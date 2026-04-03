import Promotion from "../models/promotion.model.js";
import Customer from "../models/customer.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// setup nodemailer transporter with mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// helper: personalize email content with customer data
function personalize(template, customer) {
  return template.replace(/\$\{customer\.(\w+)\}/g, (match, key) => {
    const value = customer[key];
    if (value === undefined || value === null) return match;
    if (value instanceof Date) return value.toLocaleDateString("en-IN");
    return String(value);
  });
}

// helper: build HTML email body with inline css
function buildEmailHTML(customer, personalizedContent) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #1a1a2e; color: #ffffff; padding: 28px 32px; font-size: 22px; font-weight: bold; }
        .body { padding: 28px 32px; color: #333333; font-size: 15px; line-height: 1.7; }
        .customer-info { background: #f9f9fb; border-left: 4px solid #4f46e5; border-radius: 4px; padding: 14px 18px; margin: 20px 0; font-size: 14px; color: #444; }
        .customer-info table { width: 100%; border-collapse: collapse; }
        .customer-info td { padding: 4px 8px; }
        .customer-info td:first-child { font-weight: 600; color: #1a1a2e; width: 130px; }
        .footer { background: #f0f0f5; text-align: center; padding: 16px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">📢 Special Offer Just for You</div>
        <div class="body">
          <p>Hi <strong>${customer.name}</strong>,</p>
          ${personalizedContent}
          <div class="customer-info">
            <strong>Your Account Details:</strong>
            <table>
              <tr><td>Name</td><td>${customer.name || "N/A"}</td></tr>
              <tr><td>Email</td><td>${customer.email || "N/A"}</td></tr>
              <tr><td>Phone</td><td>${customer.contactNumber || "N/A"}</td></tr>
              <tr><td>Address</td><td>${customer.address || "N/A"}</td></tr>
              <tr><td>Member Since</td><td>${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN") : "N/A"}</td></tr>
            </table>
          </div>
          <p>Thank you for being a valued customer! 🙏</p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

// send promotion email to all customers
export const sendPromotion = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ message: "Subject and content are required" });
    }

    const customers = await Customer.find(
      {},
      "email name contactNumber address createdAt"
    );

    if (!customers.length) {
      return res.status(400).json({ message: "No customers found to send emails to" });
    }

    const promotion = await Promotion.create({
      subject,
      content,
      recipients: customers.length,
      status: "sending",
    });

    let successCount = 0;
    let failCount = 0;

    for (const customer of customers) {
      try {
        const personalizedContent = personalize(content, customer);
        const personalizedSubject = personalize(subject, customer);
        const htmlBody = buildEmailHTML(customer, personalizedContent);

        await transporter.sendMail({
          from: `"Service Team" <test@yourapp.com>`,
          to: customer.email,
          subject: personalizedSubject,
          html: htmlBody,
        });

        successCount++;
        console.log(`✅ Sent to: ${customer.email} (${customer.name})`);

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (err) {
        failCount++;
        console.error(`❌ Failed to send to ${customer.email}:`, err.message);
      }
    }

    promotion.status = "completed";
    promotion.successCount = successCount;
    promotion.failCount = failCount;
    await promotion.save();

    res.status(201).json({
      success: true,
      data: promotion,
      summary: {
        total: customers.length,
        sent: successCount,
        failed: failCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all promotions
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};