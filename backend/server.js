import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

connectDB();

const app = express();

// Secure HTTP headers
app.use(helmet());

// Enable CORS for frontend integration (supporting HttpOnly cookies)
app.use(
  cors({
    origin: ["https://olivor.netlify.app", "http://localhost:5173", "https://olivor.tn", "https://www.olivor.tn"],
    credentials: true,
  }),
);

// Rate limiting to protect API endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 5000 : 300, // limit each IP to 5000 requests in development, 300 in production
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Parse JSON request body
app.use(express.json());

// Routes
app.use(["/api/users", "/users"], userRoutes);
app.use(["/api/products", "/products"], productRoutes);
app.use(["/api/orders", "/orders"], orderRoutes);
app.use(["/api/recipes", "/recipes"], recipeRoutes);
app.use(["/api/upload", "/upload"], uploadRoutes);
app.use(["/api/categories", "/categories"], categoryRoutes);
app.use(["/api/coupons", "/coupons"], couponRoutes);

app.get(["/", "/api"], (req, res) => {
  res.send("OLIVOR Luxury API is running...");
});

// 404 Not Found handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
