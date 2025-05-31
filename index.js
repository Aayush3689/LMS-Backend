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
  // methods: ["GET", "HEAD", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Range"],
};
app.use(cors(corsOptions));

// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/processed", express.static("processed"));

// === ROUTES THAT USE MULTER  ===
const courseRoute = require("@app/courses/routes/createcourse.route.js");
const lectureRoute = require("@app/lectures/routes/lectures.route.js");
app.use("/api", courseRoute);
app.use("/api", lectureRoute);

// ===  ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===  ===
const userRoute = require("@app/auth/routes/auth.route");
app.use("/api", userRoute);

// Home route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to home page",
  });
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
