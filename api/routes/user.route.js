import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

//initializing route
const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken ,updateUser);


//exporting the router as default
export default router;
