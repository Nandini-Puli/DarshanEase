const mongoose = require("mongoose");
const Donation = require("../models/Donation");
const Temple = require("../models/Temple");
const { notify } = require("../utils/notifications");

const methods = ["UPI", "Card", "Net Banking", "Razorpay"];

// ================= CREATE DONATION =================
exports.createDonation = async (req, res) => {
  const { templeId, paymentMethod } = req.body;
  const amount = Number(req.body.amount);

  if (
    !mongoose.isValidObjectId(templeId) ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !methods.includes(paymentMethod)
  ) {
    return res.status(400).json({
      success: false,
      message: "Provide a valid temple, amount, and payment method",
    });
  }

  try {
    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    const donation = await Donation.create({
      userId: req.user.id,
      templeId,
      amount,
      paymentMethod,
      transactionId: `DON_${Date.now()}${Math.floor(
        Math.random() * 10000
      )}`,
      status: "Success",
    });

    await notify(
      req.user.id,
      "Donation Successful",
      `Your donation of Rs. ${amount} to ${temple.templeName} was successful.`,
      "donation"
    );

    const populatedDonation = await donation.populate(
      "templeId",
      "templeName location image"
    );

    return res.status(201).json({
      success: true,
      message: "Donation successful",
      donation: populatedDonation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to process donation",
    });
  }
};

// ================= USER DONATIONS =================
exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      userId: req.user.id,
    })
      .populate("templeId", "templeName location image")
      .sort({ donatedAt: -1 });

    return res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch donations",
    });
  }
};

// ================= ORGANIZER DONATIONS =================
exports.getOrganizerDonations = async (req, res) => {
  try {
    const temples = await Temple.find({
      organizerId: req.user.id,
    }).select("_id");

    const donations = await Donation.find({
      templeId: {
        $in: temples.map((temple) => temple._id),
      },
    })
      .populate("userId", "username email")
      .populate("templeId", "templeName")
      .sort({ donatedAt: -1 });

    return res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch donations",
    });
  }
};

// ================= ADMIN - ALL DONATIONS =================
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("userId", "username email")
      .populate("templeId", "templeName location")
      .sort({ donatedAt: -1 });

    const total = await Donation.aggregate([
      {
        $match: {
          status: "Success",
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return res.json({
      success: true,
      count: donations.length,
      totalAmount: total[0]?.amount || 0,
      donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch donations",
    });
  }
};