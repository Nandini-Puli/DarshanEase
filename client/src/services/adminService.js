import API from "./api";

// ===============================
// Dashboard
// ===============================

export const getDashboardStats = async () => {
  try {
    const response = await API.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Dashboard Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch dashboard statistics",
      }
    );
  }
};

// ===============================
// Users
// ===============================

export const getUsers = async () => {
  try {
    const response = await API.get("/users");
    return response.data;
  } catch (error) {
    console.error("Get Users Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch users",
      }
    );
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete User Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to delete user",
      }
    );
  }
};

// ===============================
// Organizers
// ===============================

export const getOrganizers = async () => {
  try {
    const response = await API.get("/organizers");
    return response.data;
  } catch (error) {
    console.error("Get Organizers Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch organizers",
      }
    );
  }
};

export const deleteOrganizer = async (id) => {
  try {
    const response = await API.delete(`/organizers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Organizer Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to delete organizer",
      }
    );
  }
};

// ===============================
// Temples
// ===============================

export const getTemples = async () => {
  try {
    const response = await API.get("/temples");
    return response.data;
  } catch (error) {
    console.error("Get Temples Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch temples",
      }
    );
  }
};

// ===============================
// Bookings
// ===============================

export const getBookings = async () => {
  try {
    const response = await API.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Get Bookings Error:", error);

    throw (
      error.response?.data || {
        message: "Unable to fetch bookings",
      }
    );
  }
};