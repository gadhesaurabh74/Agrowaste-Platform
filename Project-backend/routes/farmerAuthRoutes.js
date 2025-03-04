const express = require("express");
const { farmerSignup, farmerLogin } = require("../controllers/farmerAuthController");

const router = express.Router();

router.post("/signup", farmerSignup);
router.post("/login", farmerLogin);

module.exports = router;