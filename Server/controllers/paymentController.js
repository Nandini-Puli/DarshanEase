const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { notify } = require("../utils/notifications");

const paymentMethods = [
  "UPI",
  "Card",
  "Net Banking",
  "Razorpay",
];

const bookingPopulate = (query) =>
  query
    .populate(
      "templeId",
      "templeName location image"
    )
    .populate(
      "slotId",
      "darshanName date startTime endTime price"
    );

// ================= CREATE PAYMENT =================
exports.createPayment = async (req, res) => {
  const { bookingId, paymentMethod } = req.body;

  if (
    !mongoose.isValidObjectId(bookingId) ||
    !paymentMethods.includes(paymentMethod)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "A valid booking and payment method are required",
    });
  }

  try {
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.bookingStatus !== "Pending" ||
      booking.paymentStatus !== "Pending"
    ) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be paid",
      });
    }

    const suffix = `${Date.now()}${Math.floor(
      Math.random() * 10000
    )}`;

    const payment = await Payment.create({
      userId: req.user.id,
      bookingId,
      amount: booking.totalPrice,
      paymentMethod,
      paymentStatus: "Success",
      paymentId: `PAY_${suffix}`,
      orderId: `ORD_${suffix}`,
    });

    booking.paymentStatus = "Success";
    booking.bookingStatus = "Confirmed";
    booking.ticketNumber = `TKT-${suffix}`;

    await booking.save();

    await notify(
      req.user.id,
      "Booking confirmed",
      "Your payment was successful and your darshan ticket is confirmed.",
      "payment"
    );

    const updatedBooking = await bookingPopulate(
      Booking.findById(booking._id)
    );

    return res.status(201).json({
      success: true,
      message: "Payment successful",
      payment,
      booking: updatedBooking,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};

// ================= GET USER PAYMENTS =================
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user.id,
    }).populate({
      path: "bookingId",
      populate: [
        {
          path: "templeId",
          select: "templeName location image",
        },
        {
          path: "slotId",
          select: "darshanName price",
        },
      ],
    });

    return res.json({
      success: true,
      count: payments.length,
      payments,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payments",
    });
  }
};

// ================= GET SINGLE PAYMENT =================
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("bookingId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({
      success: true,
      payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment",
    });
  }
};

// ================= DELETE PAYMENT =================
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.json({
      success: true,
      message: "Payment deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete payment",
    });
  }
};