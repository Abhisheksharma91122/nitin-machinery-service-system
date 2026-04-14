import "./config/env.js";
import app, { server } from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// ✅ Handle crashes (important)
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

// ✅ Start server only after DB connects
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
  });