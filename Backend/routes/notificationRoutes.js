const express = require("express");
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getNotifications);
router.patch("/:id", auth, markAsRead);
router.patch("/", auth, markAllAsRead);
router.delete("/:id", auth, deleteNotification);
router.delete("/", auth, deleteAllNotifications);

module.exports = router;