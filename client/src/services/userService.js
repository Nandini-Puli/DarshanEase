import API from "./api";

// ===============================
// Get All Users
// ===============================

export const getUsers = async () => {
  try {
    const response = await API.get("/users");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch users",
      }
    );
  }
};

// ===============================
// Get User By ID
// ===============================

export const getUserById = async (id) => {
  try {
    const response = await API.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "User not found",
      }
    );
  }
};

// ===============================
// Update User
// ===============================

export const updateUser = async (id, userData) => {
  try {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update user",
      }
    );
  }
};

// ===============================
// Delete User
// ===============================

export const deleteUser = async (id) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to delete user",
      }
    );
  }
};

// ===============================
// User Profile
// ===============================

export const getUserProfile = async () => {
  try {
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch profile",
      }
    );
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await API.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update profile",
      }
    );
  }
};