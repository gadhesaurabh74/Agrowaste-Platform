const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Fetch Error", error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Read", notification });
  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: "All Read" });
  } catch (error) {
    res.status(500).json({ message: "Update Error" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error" });
  }
};

exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ message: "All Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Error" });
  }
};

exports.createNotification = async (userId, message, type) => {
  try {
    await new Notification({ user: userId, message, type }).save();
  } catch (error) {
    console.error("Create Notification Error:", error);
  }
};