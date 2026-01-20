import express from "express";
import { googleAuth } from "../controllers/citizend.controller.js";
const Router = express.Router();

Router.post("/google", googleAuth);

export default Router;
