const Notification = require("../models/Notification");
const User = require("../models/User");

// ================= GET USER NOTIFICATIONS =================
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(
      (item) => !item.isRead
    ).length;

    return res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications",
    });
  }
};

// ================= MARK NOTIFICATION AS READ =================
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      notification,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to update notification",
    });
  }
};

// ================= DELETE NOTIFICATION =================
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.json({
      success: true,
      message: "Notification deleted",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to delete notification",
    });
  }
};

// ================= CREATE NOTIFICATION =================
exports.createNotification = async (req, res) => {
  const {
    userId,
    title,
    message,
    type = "system",
  } = req.body;

  if (!userId || !title || !message) {
    return res.status(400).json({
      success: false,
      message: "userId, title and message are required",
    });
  }

  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
    });

    return res.status(201).json({
      success: true,
      notification,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create notification",
    });
  }
};

// ================= BROADCAST NOTIFICATION =================
exports.broadcastNotification = async (req, res) => {
  const {
    title,
    message,
    type = "system",
  } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: "Title and message are required",
    });
  }

  try {
    const users = await User.find({
      role: "user",
    }).select("_id");

    await Notification.insertMany(
      users.map((user) => ({
        userId: user._id,
        title,
        message,
        type,
      }))
    );

    return res.status(201).json({
      success: true,
      message: "Notification broadcast successfully",
      count: users.length,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to broadcast notification",
    });
  }
};