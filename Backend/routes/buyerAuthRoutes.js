const express = require("express");
const { buyerSignup, buyerLogin } = require("../controllers/buyerAuthController");

const router = express.Router();

router.post("/signup", buyerSignup);
router.post("/login", buyerLogin);

module.exports = router;