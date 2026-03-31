import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export { io, server };
export default app;