import express from "express";
import { Auth } from "../middleware/userAuth.js";
import { CreateEvent } from "../controllers/eventControllers.js";

const eventRoutes = express.Router();
eventRoutes.post("/create", Auth, CreateEvent);
export default eventRoutes;
