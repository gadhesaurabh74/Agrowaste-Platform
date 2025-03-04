const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Can be a Farmer or a Buyer
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String, // Example: "offer", "message", "listing"
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false, // Initially unread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);