import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

//initializing express app
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

//connecting to MONGODB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
//Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// creating a middleware to handle error || success msg
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
