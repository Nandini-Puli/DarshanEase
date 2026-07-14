import API from "./api";

// ===============================
// Organizer Profile
// ===============================

export const getOrganizerProfile = async () => {
  try {
    const response = await API.get("/organizers/profile");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch organizer profile",
      }
    );
  }
};

export const updateOrganizerProfile = async (data) => {
  try {
    const response = await API.put("/organizers/profile", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update organizer profile",
      }
    );
  }
};

// ===============================
// Organizer Bookings
// ===============================

export const getOrganizerBookings = async () => {
  try {
    const response = await API.get("/organizers/bookings");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch bookings",
      }
    );
  }
};