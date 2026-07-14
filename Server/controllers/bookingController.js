const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Temple = require("../models/Temple");
const Darshan = require("../models/Darshan");

const { notify } = require("../utils/notifications");

// ==========================================
// Helper Functions
// ==========================================

const bookingPopulate = (query) =>
  query
    .populate(
      "templeId",
      "templeName location image openTime closeTime address state city"
    )
    .populate(
      "slotId",
      "darshanName description price date startTime endTime availableSeats bookedSeats"
    );

const validId = (id) => mongoose.isValidObjectId(id);

// ==========================================
// CREATE BOOKING
// ==========================================

exports.createBooking = async (req, res) => {
  const { templeId, slotId } = req.body;

  const numberOfPersons = Number(req.body.numberOfPersons);

  if (
    !validId(templeId) ||
    !validId(slotId) ||
    !Number.isInteger(numberOfPersons) ||
    numberOfPersons < 1
  ) {
    return res.status(400).json({
      success: false,
      message:
        "A temple, darshan, and valid number of devotees are required",
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

    const darshan = await Darshan.findOne({
      _id: slotId,
      templeId,
      isActive: true,
    });

    if (!darshan) {
      return res.status(404).json({
        success: false,
        message: "Darshan not found for this temple",
      });
    }

    // Reserve seats atomically

    const slot = await Darshan.findOneAndUpdate(
      {
        _id: slotId,
        templeId,
        isActive: true,
        availableSeats: {
          $gte: numberOfPersons,
        },
      },
      {
        $inc: {
          availableSeats: -numberOfPersons,
          bookedSeats: numberOfPersons,
        },
      },
      {
        new: true,
      }
    );

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this darshan",
      });
    }

    try {
      const booking = await Booking.create({
        userId: req.user.id,
        templeId,
        slotId,
        numberOfPersons,
        totalPrice: slot.price * numberOfPersons,
      });

      const populatedBooking = await bookingPopulate(
        Booking.findById(booking._id)
      );

      await notify(
        temple.organizerId,
        "New booking received",
        `${numberOfPersons} devotee(s) booked ${slot.darshanName}.`,
        "booking"
      );

      return res.status(201).json({
        success: true,
        message: "Booking created. Complete payment to confirm it.",
        booking: populatedBooking,
      });
    } catch (error) {
      // Rollback seat reservation

      await Darshan.findByIdAndUpdate(slotId, {
        $inc: {
          availableSeats: numberOfPersons,
          bookedSeats: -numberOfPersons,
        },
      });

      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create booking",
    });
  }
};

// ==========================================
// GET USER BOOKINGS
// ==========================================

exports.getBookings = async (req, res) => {
  try {
    const bookings = await bookingPopulate(
      Booking.find({
        userId: req.user.id,
      }).sort({
        createdAt: -1,
      })
    );

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings",
    });
  }
};

// ==========================================
// GET BOOKING BY ID
// ==========================================

exports.getBookingById = async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking id",
    });
  }

  try {
    const booking = await bookingPopulate(
      Booking.findOne({
        _id: req.params.id,
        userId: req.user.id,
      })
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking",
    });
  }
};

// ==========================================
// UPDATE BOOKING
// ==========================================

exports.updateBooking = async (req, res) => {
  const numberOfPersons = Number(req.body.numberOfPersons);

  if (!Number.isInteger(numberOfPersons) || numberOfPersons < 1) {
    return res.status(400).json({
      success: false,
      message: "Provide a valid number of devotees",
    });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be updated",
      });
    }

    const difference =
      numberOfPersons - booking.numberOfPersons;

    if (difference > 0) {
      const slot = await Darshan.findOneAndUpdate(
        {
          _id: booking.slotId,
          availableSeats: {
            $gte: difference,
          },
        },
        {
          $inc: {
            availableSeats: -difference,
            bookedSeats: difference,
          },
        },
        {
          new: true,
        }
      );

      if (!slot) {
        return res.status(400).json({
          success: false,
          message:
            "No seats available for the requested change",
        });
      }

      booking.totalPrice =
        slot.price * numberOfPersons;
    } else if (difference < 0) {
      const slot = await Darshan.findByIdAndUpdate(
        booking.slotId,
        {
          $inc: {
            availableSeats: -difference,
            bookedSeats: difference,
          },
        },
        {
          new: true,
        }
      );

      if (!slot) {
        return res.status(404).json({
          success: false,
          message: "Darshan not found",
        });
      }

      booking.totalPrice =
        slot.price * numberOfPersons;
    }

    booking.numberOfPersons = numberOfPersons;

    await booking.save();

    return res.json({
      success: true,
      message: "Booking updated",
      booking: await bookingPopulate(
        Booking.findById(booking._id)
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update booking",
    });
  }
};

// ==========================================
// CANCEL BOOKING
// ==========================================

exports.cancelBooking = async (req, res) => {
  if (!validId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid booking id",
    });
  }

  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending bookings can be cancelled",
      });
    }

    await Darshan.findByIdAndUpdate(
      booking.slotId,
      {
        $inc: {
          availableSeats: booking.numberOfPersons,
          bookedSeats: -booking.numberOfPersons,
        },
      }
    );

    booking.bookingStatus = "Cancelled";
    booking.paymentStatus = "Failed";

    await booking.save();

    await notify(
      req.user.id,
      "Booking cancelled",
      "Your pending darshan booking has been cancelled.",
      "booking"
    );

    return res.json({
      success: true,
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to cancel booking",
    });
  }
};

// ==========================================
// DELETE BOOKING
// ==========================================

exports.deleteBooking = exports.cancelBooking;