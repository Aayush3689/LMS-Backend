// dotenv integration
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

require("module-alias/register");
const cors = require("cors");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// database connection function
const connectDb = require("@config/db/connectdb.js");

// CORS with options
const corsOptions = {
  origin: "*", // You can specify allowed domains if needed
  methods: ["GET", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Range"],
};
app.use(cors(corsOptions));

// global middlewares
app.use("/uploads", express.static("uploads"));
app.use("/processed", express.static("processed"));
const courseRoute = require("@app/courses/routes/addcourse.route.js");
const lectureRoute = require("@app/lectures/routes/lectures.route.js");
app.use("/api", courseRoute);
app.use("/api", lectureRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/processed", express.static("processed"));
// Serve processed HLS files with correct headers

// routes import
const userRoute = require("@app/auth/routes/auth.route");

// routes use
app.use("/api", userRoute);

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to home page",
  });
});

// start function
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is running on the port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

start();
