const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: false },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: false }, 
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: false },
  price: { type: Number, required: false },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Offer", OfferSchema);