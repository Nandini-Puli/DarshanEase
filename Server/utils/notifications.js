const Notification = require("../models/Notification");

exports.notify = async (userId, title, message, type = "system") => {
  if (!userId) return null;
  return Notification.create({ userId, title, message, type });
};
