import API from "./api";

// ===============================
// Get All Temples
// ===============================

export const getTemples = async () => {
  try {
    const response = await API.get("/temples");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch temples",
      }
    );
  }
};

// ===============================
// Get Temple By ID
// ===============================

export const getTempleById = async (id) => {
  try {
    const response = await API.get(`/temples/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Temple not found",
      }
    );
  }
};

// ===============================
// Create Temple
// ===============================

export const createTemple = async (templeData) => {
  try {
    const response = await API.post("/temples", templeData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to create temple",
      }
    );
  }
};

// ===============================
// Update Temple
// ===============================

export const updateTemple = async (id, templeData) => {
  try {
    const response = await API.put(`/temples/${id}`, templeData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to update temple",
      }
    );
  }
};

// ===============================
// Delete Temple
// ===============================

export const deleteTemple = async (id) => {
  try {
    const response = await API.delete(`/temples/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to delete temple",
      }
    );
  }
};