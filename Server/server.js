const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect Database
connectDB();

const app = express();
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/organizers", require("./routes/organizerRoutes"));
app.use("/api/organizer", require("./routes/organizerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/temples", require("./routes/templeRoutes"));
app.use("/api/darshans", require("./routes/darshanRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Home Route
app.get("/", (req, res) => {
  res.send("DarshanEase Backend Running Successfully");
});

// Error Middleware (Always keep this at the end)
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});