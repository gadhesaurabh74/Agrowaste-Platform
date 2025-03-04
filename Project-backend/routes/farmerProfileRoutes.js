const express = require("express");
const { getFarmerProfile, updateFarmerProfile, getFarmerDashboardStats } = require("../controllers/farmerProfileController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFarmerProfile);
router.put("/",upload.single("profileImage"), authMiddleware, updateFarmerProfile);
router.get("/dashboard", authMiddleware, getFarmerDashboardStats);


module.exports = router;