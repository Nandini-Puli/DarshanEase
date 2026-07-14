const User = require("../models/User");
const Organizer = require("../models/Organizer");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");
const Feedback = require("../models/Feedback");
const Temple = require("../models/Temple");
const Darshan = require("../models/Darshan");

const bcrypt = require("bcryptjs");

// ==========================================
// GET PROFILE
// ==========================================
exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let profile;

    if (role === "organizer") {
      profile = await Organizer.findById(id).select("-password");
    } else {
      profile = await User.findById(id).select("-password");
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    let stats = {};

    if (role === "organizer") {
      const temples = await Temple.find({
        organizerId: id,
      }).select("_id");

      const templeIds = temples.map((temple) => temple._id);

      stats = {
        templeCount: temples.length,

        darshanCount: await Darshan.countDocuments({
          templeId: {
            $in: templeIds,
          },
        }),

        bookingCount: await Booking.countDocuments({
          templeId: {
            $in: templeIds,
          },
        }),
      };
    } else {
      stats = {
        bookingCount: await Booking.countDocuments({
          userId: id,
        }),

        donationCount: await Donation.countDocuments({
          userId: id,
        }),

        feedbackCount: await Feedback.countDocuments({
          userId: id,
        }),
      };
    }

    return res.status(200).json({
      success: true,
      profile,
      stats,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================
exports.updateProfile = async (req, res) => {
  try {
    const { id, role } = req.user;

    const {
      username,
      phone,
      profileImage,
    } = req.body;

    let profile;

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (phone) {
      updateData.phone = phone;
    }

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    if (role === "organizer") {
      profile = await Organizer.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");
    } else {
      profile = await User.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: profile,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================
exports.changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current and new passwords.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password.",
      });
    }

    const Model =
      req.user.role === "organizer"
        ? Organizer
        : User;

    const user = await Model.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};