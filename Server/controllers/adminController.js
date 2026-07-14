const User = require("../models/User");
const Organizer = require("../models/Organizer");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const Temple = require("../models/Temple");
const Darshan = require("../models/Darshan");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Donation = require("../models/Donation");

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await Organizer.countDocuments();
    const totalTemples = await Temple.countDocuments();
    const totalDarshans = await Darshan.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Today's Bookings
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    // Total Revenue
    const totalRevenueResult = await Payment.aggregate([
      { $match: { paymentStatus: "Success" } },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]);
    const revenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].revenue : 0;

    // Popular Temple (temple with the most bookings)
    const popularTempleGroup = await Booking.aggregate([
      { $group: { _id: "$templeId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    let popularTempleName = "N/A";
    if (popularTempleGroup.length > 0 && popularTempleGroup[0]._id) {
      const popularTemple = await Temple.findById(popularTempleGroup[0]._id);
      if (popularTemple) {
        popularTempleName = popularTemple.templeName;
      }
    }

    // Available Slots (darshans with available seats > 0)
    const availableSlots = await Darshan.countDocuments({ availableSeats: { $gt: 0 } });

    // Booked Slots (darshans with booked seats > 0)
    const bookedSlots = await Darshan.countDocuments({ bookedSeats: { $gt: 0 } });

    const donationRevenueResult = await Donation.aggregate([{ $match: { status: "Success" } }, { $group: { _id: null, amount: { $sum: "$amount" } } }]);
    const mostBookedDarshanGroup = await Booking.aggregate([{ $group: { _id: "$slotId", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }]);
    const mostBookedDarshan = mostBookedDarshanGroup[0]?._id ? await Darshan.findById(mostBookedDarshanGroup[0]._id).select("darshanName") : null;
    const monthlyBookings = await Booking.aggregate([{ $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, bookings: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }, { $sort: { "_id.year": 1, "_id.month": 1 } }, { $limit: 12 }]);
    const templeWiseBookings = await Booking.aggregate([{ $group: { _id: "$templeId", bookings: { $sum: 1 } } }, { $sort: { bookings: -1 } }, { $limit: 10 }, { $lookup: { from: "temples", localField: "_id", foreignField: "_id", as: "temple" } }, { $unwind: "$temple" }, { $project: { _id: 0, name: "$temple.templeName", bookings: 1 } }]);
    res.status(200).json({
      success: true,
      // camelCase fields expected by frontend
      users: totalUsers,
      organizers: totalOrganizers,
      temples: totalTemples,
      darshans: totalDarshans,
      bookings: totalBookings,
      // reports fields
      totalUsers,
      totalOrganizers,
      totalTemples,
      totalDarshans,
      totalBookings,
      todayBookings,
      revenue,
      totalRevenue: revenue,
      donationRevenue: donationRevenueResult[0]?.amount || 0,
      popularTemple: popularTempleName,
      mostBookedDarshan: mostBookedDarshan?.darshanName || "N/A",
      monthlyBookings: monthlyBookings.map((item) => ({ name: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`, bookings: item.bookings, revenue: item.revenue })),
      templeWiseBookings,
      availableSlots,
      bookedSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
