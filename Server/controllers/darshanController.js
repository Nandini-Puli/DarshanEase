const Darshan = require("../models/Darshan");
const Temple = require("../models/Temple");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ================= CREATE DARSHAN =================
exports.createDarshan = async (req, res) => {
  try {

    const {
      templeId,
      darshanName,
      description,
      date,
      startTime,
      endTime,
      availableSeats,
      price,
    } = req.body;

    // Validation
    if (
      !templeId ||
      !darshanName ||
      !date ||
      !startTime ||
      !endTime ||
      availableSeats == null ||
      price == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check Temple
    const temple = await Temple.findById(templeId);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    if (temple.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only manage slots for your own temples" });
    }

    // Create Darshan
    const darshan = await Darshan.create({
      templeId,
      darshanName,
      description,
      date,
      startTime,
      endTime,
      availableSeats,
      price,
    });
    const users = await User.find({ role: "user" }).select("_id");
    if (users.length) await Notification.insertMany(users.map((user) => ({ userId: user._id, title: "New darshan available", message: `${darshanName} is now available at ${temple.templeName}.`, type: "darshan" })));

    res.status(201).json({
      success: true,
      message: "Darshan Created Successfully",
      darshan,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL DARSHANS =================
exports.getDarshans = async (req, res) => {
  try {

    const darshans = await Darshan.find({ isActive: true })
      .populate("templeId", "templeName location");

    res.status(200).json({
      success: true,
      count: darshans.length,
      darshans,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ORGANIZER DARSHANS =================
exports.getOrganizerDarshans = async (req, res) => {
  try {
    // Find organizer's temple
    const temple = await Temple.findOne({
      organizerId: req.user.id,
    });

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "No temple found for this organizer",
      });
    }

    const darshans = await Darshan.find({
      templeId: temple._id,
      isActive: true,
    }).populate("templeId", "templeName location");

    res.status(200).json({
      success: true,
      count: darshans.length,
      darshans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE DARSHAN =================
exports.getDarshan = async (req, res) => {
  try {

    const darshan = await Darshan.findById(req.params.id)
      .populate("templeId", "templeName location");

    if (!darshan) {
      return res.status(404).json({
        success: false,
        message: "Darshan not found",
      });
    }

    res.status(200).json({
      success: true,
      darshan,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET DARSHANS BY TEMPLE =================
exports.getTempleDarshans = async (req, res) => {
  try {

    const darshans = await Darshan.find({
      templeId: req.params.templeId,
    });

    res.status(200).json({
      success: true,
      count: darshans.length,
      darshans,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE DARSHAN =================
exports.updateDarshan = async (req, res) => {
  try {
    const existingDarshan = await Darshan.findById(req.params.id).populate("templeId", "organizerId");
    if (!existingDarshan) return res.status(404).json({ success: false, message: "Darshan not found" });
    if (existingDarshan.templeId.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only manage slots for your own temples" });
    }
    const darshan = await Darshan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!darshan) {
      return res.status(404).json({
        success: false,
        message: "Darshan not found",
      });
    }

    const temple = await Temple.findById(darshan.templeId);
    if (!temple || temple.organizerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only manage slots for your own temples" });
    }

    res.status(200).json({
      success: true,
      message: "Darshan Updated Successfully",
      darshan,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE DARSHAN =================
exports.deleteDarshan = async (req, res) => {
  try {

    const darshan = await Darshan.findById(req.params.id);

    if (!darshan) {
      return res.status(404).json({
        success: false,
        message: "Darshan not found",
      });
    }

    await Darshan.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Darshan Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
