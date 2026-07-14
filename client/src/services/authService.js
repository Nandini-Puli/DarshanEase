import API from "./api";

// ==========================
// User Authentication
// ==========================

export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "User registration failed",
    };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await API.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "User login failed",
    };
  }
};

// ==========================
// Organizer Authentication
// ==========================

export const registerOrganizer = async (organizerData) => {
  try {
    const response = await API.post(
      "/auth/organizer/register",
      organizerData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Organizer registration failed",
    };
  }
};

export const loginOrganizer = async (loginData) => {
  try {
    const response = await API.post(
      "/auth/organizer/login",
      loginData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Organizer login failed",
    };
  }
};

// ==========================
// Admin Authentication
// ==========================

export const loginAdmin = async (loginData) => {
  try {
    const response = await API.post(
      "/auth/admin/login",
      loginData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Admin login failed",
    };
  }
};