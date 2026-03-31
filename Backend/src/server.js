import dotenv from "dotenv";
import app, { io, server} from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
