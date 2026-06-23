import express from "express";
import { searchSemanticGlobal } from "../controller/search.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

// Define search endpoint
router.post("/", secureRoute, searchSemanticGlobal);

export default router;
