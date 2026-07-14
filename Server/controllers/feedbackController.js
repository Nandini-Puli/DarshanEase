const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const Temple = require("../models/Temple");
const Booking = require("../models/Booking");

// ================= CREATE FEEDBACK =================
exports.createFeedback = async (req, res) => {
  const { templeId, bookingId } = req.body;
  const rating = Number(req.body.rating);
  const feedbackText = String(req.body.feedback || "").trim();

  if (
    !mongoose.isValidObjectId(templeId) ||
    !mongoose.isValidObjectId(bookingId) ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !feedbackText
  ) {
    return res.status(400).json({
      success: false,
      message:
        "A confirmed booking, 1-5 rating, and feedback are required",
    });
  }

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
      templeId,
      bookingStatus: "Confirmed",
      paymentStatus: "Success",
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message:
          "Feedback is allowed only for your confirmed booking",
      });
    }

    const item = await Feedback.create({
      userId: req.user.id,
      templeId,
      bookingId,
      rating,
      feedback: feedbackText,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted",
      feedback: item,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Feedback has already been submitted for this booking",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit feedback",
    });
  }
};

// ================= GET TEMPLE FEEDBACK =================
exports.getTempleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      templeId: req.params.templeId,
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(20);

    const summary = await Feedback.aggregate([
      {
        $match: {
          templeId: new mongoose.Types.ObjectId(
            req.params.templeId
          ),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    return res.json({
      success: true,
      count: feedback.length,
      averageRating: Number(
        (summary[0]?.averageRating || 0).toFixed(1)
      ),
      feedback,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to fetch feedback",
    });
  }
};

// ================= ORGANIZER FEEDBACK =================
exports.getOrganizerFeedback = async (req, res) => {
  try {
    const temples = await Temple.find({
      organizerId: req.user.id,
    }).select("_id");

    const feedback = await Feedback.find({
      templeId: {
        $in: temples.map((temple) => temple._id),
      },
    })
      .populate("userId", "username email")
      .populate("templeId", "templeName")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: feedback.length,
      feedback,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch feedback",
    });
  }
};

// ================= ADMIN - ALL FEEDBACK =================
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("userId", "username email")
      .populate("templeId", "templeName location")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: feedback.length,
      feedback,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch feedback",
    });
  }
};

// ================= DELETE FEEDBACK =================
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(
      req.params.id
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.json({
      success: true,
      message: "Feedback deleted",
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to delete feedback",
    });
  }
};