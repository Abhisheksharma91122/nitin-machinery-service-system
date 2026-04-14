import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import http from "http";

const app = express();

// ✅ Trust proxy (important for deployment platforms)
app.set("trust proxy", 1);

// ✅ Secure CORS (NO "*")
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ✅ Body parser
app.use(express.json({ limit: "10mb" }));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Routes
app.use("/api", routes);

// ✅ Create server
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ (Optional but good) socket connection log
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

export { io, server };
export default app;