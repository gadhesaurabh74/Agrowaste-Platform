const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
  location: { type: String, required: false },
  profileImage: { type: String }, // Cloudinary URL
}, { timestamps: true });



module.exports = mongoose.model("Farmer", FarmerSchema);