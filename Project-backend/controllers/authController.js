const Farmer = require("../models/Farmer");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (user) => jwt.sign({ id: user._id, role: "farmer" }, config.jwtSecret, { expiresIn: "7d" });

exports.signupFarmer = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;
    if (await Farmer.findOne({ email })) return res.status(400).json({ message: "Email exists" });
    const farmer = new Farmer({ name, email, password, phone, location });
    await farmer.save();
    res.status(201).json({ token: generateToken(farmer), farmer });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmer = await Farmer.findOne({ email });
    if (!farmer || !(await farmer.comparePassword(password))) return res.status(400).json({ message: "Invalid Credentials" });
    res.json({ token: generateToken(farmer), farmer });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};