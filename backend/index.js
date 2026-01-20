import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";



import adminRoutes from "./routes/admin.routes.js";
import AuthRoutes from "./routes/auth.routes.js";
import adcRoutes from "./routes/Adc.routes.js";
import stampRoutes from "./routes/stamp.routes.js";
import bankRoutes from "./routes/bank.routes.js";
import CitizenRoutes from "./routes/citizen.route.js";
import aiRoutes from "./routes/Ai.routes.js";
import uploadRoutes from "./routes/upload.routes.js";




import connectDB from "./database/Database.js";
import { connectCloudinary } from "./utils/cloudinaryConfig.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import { seedSuperAdmin } from "./utils/seed.js";
import { app , server } from "./utils/socket.js";
import "./utils/cronJobs.js";






const port = process.env.PORT;


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
app.use("/api/auth", CitizenRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/adc", adcRoutes);
app.use("/api/stamp", stampRoutes);
app.use("/api/bank", bankRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/uploadrag", uploadRoutes);


app.use(errorMiddleware);




const startServer = async () => {
  try {
    await connectDB();
    await seedSuperAdmin();
    connectCloudinary();

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Startup Error:", error);
  }
};

startServer();
