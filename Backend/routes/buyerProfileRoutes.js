const express = require("express");
const { getBuyerProfile, updateBuyerProfile, getBuyerDashboardStats } = require("../controllers/buyerProfileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware"); // For profile picture uploads

const router = express.Router();

router.get("/", authMiddleware, getBuyerProfile);
router.put("/", upload.single("profileImage"), authMiddleware, updateBuyerProfile);
router.get("/dashboard", authMiddleware, getBuyerDashboardStats);

module.exports = router;