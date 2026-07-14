import API from "./api";

// ==========================
// Create Booking
// ==========================

export const createBooking = async (bookingData) => {
  try {
    const response = await API.post(
      "/bookings",
      bookingData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Booking failed",
    };
  }
};

// ==========================
// Get My Bookings
// ==========================

export const getMyBookings = async () => {
  try {
    const response = await API.get("/bookings");

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to fetch bookings",
    };
  }
};

// ==========================
// Get Booking by ID
// ==========================

export const getBookingById = async (id) => {
  try {
    const response = await API.get(
      `/bookings/${id}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Booking not found",
    };
  }
};

// ==========================
// Cancel Booking
// ==========================

export const cancelBooking = async (id) => {
  try {
    const response = await API.delete(
      `/bookings/${id}`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to cancel booking",
    };
  }
};
