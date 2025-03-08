import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth_route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// 🛠️ Move this above routes!
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); // Allows form data parsing

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
    connectDB();
});
