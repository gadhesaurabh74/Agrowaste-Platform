const Farmer = require("../models/Farmer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.farmerSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await Farmer.findOne({ email })) return res.status(400).json({ message: "Email exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const farmer = await Farmer.create({ name, email, password: hashedPassword, phone });
    const token = jwt.sign({ id: farmer._id, role: "farmer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.farmerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmer = await Farmer.findOne({ email });
    if (!farmer || !(await bcrypt.compare(password, farmer.password))) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: farmer._id, role: "farmer" }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, farmer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};