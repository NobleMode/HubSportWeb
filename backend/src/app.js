import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import prisma from "./config/database.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Middleware Configuration
 */
// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Uploads Static Folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Request Logger (Development)
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to SportHub Vietnam API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      products: "/api/products",
    },
  });
});

app.use("/api", routes);

/**
 * Error Handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * Database Connection & Server Start
 */
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start server - but skip listen if on Vercel
    if (process.env.SETUP_ENV !== 'Vercel') {
      app.listen(config.port, () => {
        console.log(
          `🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`,
        );
        console.log(`📍 API URL: http://localhost:${config.port}`);
      });
    } else {
      console.log("🚀 Server running on Vercel (Serverless Mode)");
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start the server
startServer();

export default app;
