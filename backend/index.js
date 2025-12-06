import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./utils/cronJobs.js"

import adminRoutes from "./routes/admin.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import adcRoutes from "./routes/Adc.routes.js";
import stampRoutes from "./routes/stamp.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import districtsRouter from "./routes/districts.js";


import connectDB from "./database/Database.js";
import { connectCloudinary } from "./utils/cloudinaryConfig.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { seedSuperAdmin } from "./utils/seed.js";
import aiRoutes from "./routes/Ai.routes.js";
import CitizenRoutes from "./routes/citizen.route.js";







const port = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


// routes
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/adc", adcRoutes);
app.use("/api/stamp", stampRoutes);
app.use("/api/bank", bankRoutes);


app.use("/api/districts", districtsRouter)


app.use("/api/ai", aiRoutes);
app.use("/api/auth", CitizenRoutes);


app.use(errorMiddleware);




const startServer = async () => {
  try {
    await connectDB();
    await seedSuperAdmin();
    connectCloudinary();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
  }
};

startServer();
