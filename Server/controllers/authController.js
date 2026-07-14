const User = require("../models/User");
const Organizer = require("../models/Organizer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ================= USER REGISTER =================
exports.register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });

    const token = generateToken(user._id, "user");

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token,
      accountType: "user",
      user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= USER LOGIN =================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      accountType: user.role,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ORGANIZER REGISTER =================
exports.registerOrganizer = async (req, res) => {
  try {

    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check existing organizer
    const organizerExists = await Organizer.findOne({ email });

    if (organizerExists) {
      return res.status(400).json({
        success: false,
        message: "Organizer already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organizer
    const organizer = await Organizer.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "organizer",
    });

    // Generate JWT
    const token = generateToken(
      organizer._id,
      "organizer"
    );

    res.status(201).json({
      success: true,
      message: "Organizer Registered Successfully",
      token,
      accountType: "organizer",
      organizer: {
        id: organizer._id,
        username: organizer.username,
        email: organizer.email,
        phone: organizer.phone,
        role: organizer.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ORGANIZER LOGIN =================
exports.loginOrganizer = async (req, res) => {
  try {

    const { email, password } = req.body;

    const organizer = await Organizer.findOne({ email });

    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      organizer.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(
      organizer._id,
      "organizer"
    );

    res.status(200).json({
      success: true,
      message: "Organizer Login Successful",
      token,
      accountType: "organizer",
      organizer: {
        id: organizer._id,
        username: organizer.username,
        email: organizer.email,
        phone: organizer.phone,
        role: organizer.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};