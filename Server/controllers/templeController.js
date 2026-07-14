const Temple = require("../models/Temple");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ================= ADD TEMPLE =================
exports.addTemple = async (req, res) => {
  try {
    const {
      templeName,
      location,
      description,
      openTime,
      closeTime,
      organizerId,
      address,
      state,
      city,
      image,
    } = req.body;

    // Validation
    if (!templeName || !location || !description || !openTime || !closeTime) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check duplicate temple
    const templeExists = await Temple.findOne({ templeName });

    if (templeExists) {
      return res.status(400).json({
        success: false,
        message: "Temple already exists",
      });
    }

    const organizerIdToUse = organizerId || req.user.id;

    const temple = await Temple.create({
      templeName,
      location,
      description,
      openTime,
      closeTime,
      organizerId: organizerIdToUse,
      address: address || "",
      state: state || "",
      city: city || "",
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Temple Added Successfully",
      temple,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL TEMPLES =================
exports.getTemples = async (req, res) => {
  try {
    const temples = await Temple.find()
      .populate("organizerId", "username email");

    res.status(200).json({
      success: true,
      count: temples.length,
      temples,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE TEMPLE =================
const Darshan = require("../models/Darshan");

exports.getTemple = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id)
      .populate("organizerId", "username email");

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    // Populate darshans (slots) dynamically
    console.log("Temple ID:", temple._id);
    const darshans = await Darshan.find({
      templeId: temple._id,
    });
    console.log("Darshans:", darshans);

    res.status(200).json({
      success: true,
      ...temple._doc,
      organizerName: temple.organizerId?.username || "N/A",
      darshans,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE TEMPLE =================
exports.updateTemple = async (req, res) => {
  try {

    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }
    const users = await User.find({ role: "user" }).select("_id");
    if (users.length) await Notification.insertMany(users.map((user) => ({ userId: user._id, title: "Temple details updated", message: `${temple.templeName} has updated its information.`, type: "temple" })));

    res.status(200).json({
      success: true,
      message: "Temple Updated Successfully",
      temple,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE TEMPLE =================
exports.deleteTemple = async (req, res) => {
  try {

    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: "Temple not found",
      });
    }

    await Temple.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Temple Deleted Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
