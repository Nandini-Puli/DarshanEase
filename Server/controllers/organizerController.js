const Organizer = require("../models/Organizer");

// Get All Organizers
exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      organizers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Organizer
exports.getOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findById(req.params.id).select("-password");

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found",
      });
    }

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Organizer
exports.updateOrganizer = async (req, res) => {
  try {
    const organizer = await Organizer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found",
      });
    }

    res.status(200).json({
      message: "Organizer Updated Successfully",
      organizer,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Organizer
exports.deleteOrganizer = async (req, res) => {
  try {
    await Organizer.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Organizer Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ORGANIZER DASHBOARD STATS =================
const Temple = require("../models/Temple");
const Darshan = require("../models/Darshan");
const Booking = require("../models/Booking");
const Donation = require("../models/Donation");

exports.getDashboardStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Find all temples owned by this organizer
    const temples = await Temple.find({ organizerId });
    const templeIds = temples.map((t) => t._id);

    // Find all darshan slots for these temples
    const darshansCount = await Darshan.countDocuments({
      templeId: { $in: templeIds },
    });

    // Find all bookings for these temples
    const bookingsCount = await Booking.countDocuments({
      templeId: { $in: templeIds },
    });

    const confirmedBookings = await Booking.find({ templeId: { $in: templeIds }, paymentStatus: "Success" });
    const revenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    res.status(200).json({
      success: true,
      temples: temples.length,
      darshans: darshansCount,
      bookings: bookingsCount,
      revenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const temples = await Temple.find({ organizerId: req.user.id }).select("_id");
    const query = { templeId: { $in: temples.map((temple) => temple._id) } };
    if (req.query.templeId) query.templeId = req.query.templeId;
    if (req.query.slotId) query.slotId = req.query.slotId;
    if (req.query.date) { const start = new Date(req.query.date); const end = new Date(start); end.setDate(end.getDate() + 1); query.createdAt = { $gte: start, $lt: end }; }
    if (req.query.search) query.ticketNumber = { $regex: req.query.search, $options: "i" };
    const bookings = await Booking.find(query).populate("userId", "username email phone").populate("templeId", "templeName").populate("slotId", "darshanName date startTime").sort({ createdAt: -1 });
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to fetch bookings" }); }
};

exports.getBookingExport = async (req, res) => {
  try {
    const temples = await Temple.find({ organizerId: req.user.id }).select("_id");
    const bookings = await Booking.find({ templeId: { $in: temples.map((temple) => temple._id) } }).populate("userId", "username email").populate("templeId", "templeName").populate("slotId", "darshanName date");
    const rows = ["Ticket,User,Email,Temple,Darshan,Persons,Total,Booking Status,Payment Status"].concat(bookings.map((item) => [item.ticketNumber || "", item.userId?.username || "", item.userId?.email || "", item.templeId?.templeName || "", item.slotId?.darshanName || "", item.numberOfPersons, item.totalPrice, item.bookingStatus, item.paymentStatus].map((value) => `\"${String(value).replace(/\"/g, '\"\"')}\"`).join(",")));
    res.setHeader("Content-Type", "text/csv"); res.setHeader("Content-Disposition", "attachment; filename=bookings.csv"); return res.send(rows.join("\n"));
  } catch (error) { return res.status(500).json({ success: false, message: "Unable to export bookings" }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { action } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const temples = await Temple.find({ organizerId: req.user.id }).select("_id");
    const isOwned = temples.some((temple) => temple._id.toString() === booking.templeId.toString());

    if (!isOwned) {
      return res.status(403).json({ success: false, message: "You can only manage your own bookings" });
    }

    if (action === "approve") {
      booking.bookingStatus = "Confirmed";
      booking.paymentStatus = "Success";
      if (!booking.ticketNumber) booking.ticketNumber = `TKT-${Date.now()}`;
    } else if (action === "reject") {
      booking.bookingStatus = "Cancelled";
      booking.paymentStatus = "Failed";
    } else {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    await booking.save();
    return res.json({ success: true, message: `Booking ${action === "approve" ? "approved" : "rejected"}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update booking status" });
  }
};
