const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Farmer = require("../models/Farmer");
const Buyer = require("../models/Buyer");

router.get("/", auth, async (req, res) => {
  try {
    const Model = req.user.role === "farmer" ? Farmer : Buyer;
    const user = await Model.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({...user.toObject(), role: req.user.role});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;