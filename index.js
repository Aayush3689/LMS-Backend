// Sentry initialization (instrumentation)
require("./instrument.js");
const Sentry = require("@sentry/node");

// dotenv integration
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

require("module-alias/register");
const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDb = require("@config/db/connectdb.js");

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Range"],
};
app.use(cors(corsOptions));

// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/processed", express.static("processed"));

// === ROUTES THAT USE MULTER (must come BEFORE express.json()) ===
const courseRoute = require("@app/courses/routes/addcourse.route.js");
const lectureRoute = require("@app/lectures/routes/lectures.route.js");
app.use("/api", courseRoute);
app.use("/api", lectureRoute);

// === JSON + URL-ENCODED MIDDLEWARE ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === ROUTES THAT DON'T USE MULTER ===
const userRoute = require("@app/auth/routes/auth.route");
app.use("/api", userRoute);

// Home route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to home page",
  });
});

// test error route
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Sentry error handler (must be after all routes and middleware)
Sentry.setupExpressErrorHandler(app);
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// Server start
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    return error;
  }
};

start();
