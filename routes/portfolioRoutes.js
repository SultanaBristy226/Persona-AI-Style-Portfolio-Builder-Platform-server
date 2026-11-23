import express from "express";
import {
  getMyPortfolio,
  updateMyPortfolio,
  getPublicPortfolio,
} from "../controllers/portfolioController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, getMyPortfolio);
router.put("/me", protect, updateMyPortfolio);
router.get("/public/:slug", getPublicPortfolio);

export default router;