import express from "express";
import { test } from "../controllers/user.controller.js";

//initializing route
const router = express.Router();

router.get("/test", test);


//exporting the router as default
export default router;
