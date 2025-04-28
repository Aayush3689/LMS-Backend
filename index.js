// dotenv integration
require("dotenv").config();
require("module-alias/register");
const cors = require("cors");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// database connection function
const connectDb = require("@config/db/connectdb.js");

// global middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"))
app.use("/processed", express.static("processed"))

// routes import
const userRoute = require("@app/Auth/routes/auth.route");
const courseRoute = require("@app/Courses/routes/addcourse.route.js");
const lectureRoute = require('@app/Lectures/routes/lectures.route.js')

// routes use
app.use("/api", userRoute);
app.use("/api", courseRoute);
app.use('/api', lectureRoute);

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
