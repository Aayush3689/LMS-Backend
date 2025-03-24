// dotenv integration
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// database connection function
const connectDb = require('./src/db/connectdb')

// global middlewares
app.use(cors());
app.use(express.json());

// routes import
const userRoute = require("./src/auth/routes/auth.route")

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
    await connectDb(process.env.MONGO_URI)
    app.listen(PORT, () => {
      console.log(`server is running on the port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

start();
