const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  title: { type: String, required: false },
  description: { type: String, required: false },
  category: { type: String, required: false },
  quantity: { type: Number, required: false },
  price: { type: Number, required: false },
  location: { type: String, required: false },
  image: { type: String }, // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model("Listing", ListingSchema);