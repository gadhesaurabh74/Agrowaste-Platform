const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  company: { type: String }, // Optional field for company name
}, { timestamps: true });

module.exports = mongoose.model("Buyer", buyerSchema);