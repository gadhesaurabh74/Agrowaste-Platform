const Buyer = require("../models/Buyer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.buyerSignup = async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    if (await Buyer.findOne({ email })) return res.status(400).json({ message: "Email exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const buyer = await Buyer.create({ name, email, password: hashedPassword, phone, company });
    const token = jwt.sign({ id: buyer._id, role: "buyer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, buyer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.buyerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await Buyer.findOne({ email });
    if (!buyer || !(await bcrypt.compare(password, buyer.password))) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: buyer._id, role: "buyer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, buyer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};