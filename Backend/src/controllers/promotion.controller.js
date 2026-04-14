import Promotion from "../models/promotion.model.js";
import Customer from "../models/customer.model.js";
import nodemailer from "nodemailer";

// ✅ 1. Validate ENV at startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL CONFIG MISSING in .env");
  process.exit(1);
}

// ✅ 2. Transporter (pooled for performance)
const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ 3. Verify transporter once on startup
(async () => {
  try {
    await transporter.verify();
    console.log("✅ Email system ready");
  } catch (err) {
    console.error("❌ Email config error:", err.message);
  }
})();

// ✅ 4. Email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ 5. Template personalization — replaces ${customer.field} tokens
function personalize(template, customer) {
  return template.replace(/\$\{customer\.(\w+)\}/g, (_, key) => {
    const value = customer[key];
    if (value == null) return "";
    if (value instanceof Date) return value.toLocaleDateString("en-IN");
    return String(value);
  });
}

// ✅ 6. Production-grade HTML email template
function buildEmailHTML(customer, content) {
  const year = new Date().getFullYear();
  const customerName = customer.name || "Valued Customer";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Nitin Machinery</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #f0f2f5;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 15px;
      color: #2c2c2c;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f0f2f5;
      padding: 32px 16px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    /* ── HEADER ── */
    .header {
      background: linear-gradient(135deg, #0f2544 0%, #1a3a6b 60%, #1e4080 100%);
      padding: 32px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -30px; right: -30px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: -40px; left: -20px;
      width: 120px; height: 120px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }
    .header-logo {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .header-icon {
      width: 38px;
      height: 38px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    .header-title {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header-subtitle {
      color: rgba(255,255,255,0.6);
      font-size: 12px;
      margin-top: 4px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* ── GREETING BANNER ── */
    .greeting-banner {
      background: linear-gradient(90deg, #f8faff 0%, #eef3ff 100%);
      border-left: 4px solid #1a3a6b;
      padding: 18px 40px;
    }
    .greeting-banner p {
      font-size: 16px;
      color: #1a3a6b;
      font-weight: 600;
    }
    .greeting-banner span {
      color: #2c2c2c;
      font-weight: 400;
      font-size: 13px;
    }

    /* ── BODY ── */
    .body {
      padding: 32px 40px;
      color: #3a3a3a;
      line-height: 1.75;
    }
    .body-content {
      font-size: 15px;
      white-space: pre-wrap;
      color: #444;
    }
    .divider {
      border: none;
      border-top: 1px solid #eee;
      margin: 28px 0;
    }
    .signature {
      font-size: 14px;
      color: #555;
    }
    .signature strong {
      display: block;
      color: #0f2544;
      font-size: 15px;
      margin-bottom: 2px;
    }

    /* ── FOOTER ── */
    .footer {
      background: #f8f9fb;
      border-top: 1px solid #eaecef;
      padding: 20px 40px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      color: #888;
      line-height: 1.6;
    }
    .footer a {
      color: #1a3a6b;
      text-decoration: none;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 620px) {
      .header, .greeting-banner, .body, .footer { padding-left: 20px; padding-right: 20px; }
      .header-title { font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- HEADER -->
      <div class="header">
        <div class="header-logo">
          <div class="header-icon">⚙️</div>
          <div>
            <div class="header-title">Nitin Machinery</div>
            <div class="header-subtitle">Industrial Solutions</div>
          </div>
        </div>
      </div>

      <!-- GREETING -->
      <div class="greeting-banner">
        <p>Dear ${customerName}</p>
        <span>We have a special message for you.</span>
      </div>

      <!-- BODY -->
      <div class="body">
        <div class="body-content">${content}</div>

        <hr class="divider"/>

        <div class="signature">
          <strong>Nitin Machinery Team</strong>
          For queries, reply to this email or contact us directly.
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <p>
          © ${year} Nitin Machinery. All rights reserved.<br/>
          You are receiving this email because you are a registered customer.<br/>
          <a href="mailto:${process.env.EMAIL_USER}">Unsubscribe</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ✅ 7. SEND PROMOTION — batched, resilient
export const sendPromotion = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: "Subject and content are required." });
    }

    const customers = await Customer.find({}, "email name createdAt contactNumber address").lean();

    if (!customers.length) {
      return res.status(404).json({ success: false, message: "No customers found." });
    }

    const promotion = await Promotion.create({
      subject,
      content,
      recipients: customers.length,
      status: "sending",
    });

    let successCount = 0;
    let failCount = 0;
    const BATCH_SIZE = 10;
    const BATCH_DELAY_MS = 1200; // slightly > 1s to be safe with Gmail

    for (let i = 0; i < customers.length; i += BATCH_SIZE) {
      const batch = customers.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (customer) => {
          if (!isValidEmail(customer.email)) {
            console.warn(`⚠️  Skipping invalid email: ${customer.email}`);
            failCount++;
            return;
          }

          try {
            const personalizedContent = personalize(content, customer);
            const personalizedSubject = personalize(subject, customer);
            const html = buildEmailHTML(customer, personalizedContent);

            await transporter.sendMail({
              from: `"Nitin Machinery" <${process.env.EMAIL_USER}>`,
              to: customer.email,
              subject: personalizedSubject,
              html,
              // Plain-text fallback
              text: `Dear ${customer.name || "Customer"},\n\n${personalizedContent}\n\nRegards,\nNitin Machinery Team`,
            });

            successCount++;
          } catch (err) {
            failCount++;
            console.error(`❌ Failed for ${customer.email}:`, err.message);
          }
        })
      );

      // Delay between batches (prevents Gmail rate-limiting)
      if (i + BATCH_SIZE < customers.length) {
        await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
      }
    }

    promotion.status = failCount === customers.length ? "failed" : "completed";
    promotion.successCount = successCount;
    promotion.failCount = failCount;
    await promotion.save();

    return res.status(201).json({
      success: true,
      summary: {
        total: customers.length,
        sent: successCount,
        failed: failCount,
      },
      data: promotion,
    });
  } catch (error) {
    console.error("❌ Promotion Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ✅ 8. GET PROMOTIONS — with pagination support
export const getPromotions = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [promotions, total] = await Promise.all([
      Promotion.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Promotion.countDocuments(),
    ]);

    return res.json({
      success: true,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data: promotions,
    });
  } catch (error) {
    console.error("❌ Fetch Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};