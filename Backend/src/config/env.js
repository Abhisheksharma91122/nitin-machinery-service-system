import dotenv from "dotenv";
dotenv.config(); 

// Export them so you can check if they are missing early
export const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL, PORT, MONGO_URI } = process.env;