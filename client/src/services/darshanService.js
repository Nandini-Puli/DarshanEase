import API from "./api";

// Get All Darshans
export const getAllDarshans = async () => {
  const response = await API.get("/darshans");
  return response.data;
};

// Get Darshan By ID
export const getDarshanById = async (id) => {
  const response = await API.get(`/darshans/${id}`);
  return response.data;
};

// Get Darshans By Temple
export const getTempleDarshans = async (templeId) => {
  const response = await API.get(`/darshans/temple/${templeId}`);
  return response.data;
};

// Create Darshan
export const createDarshan = async (darshanData) => {
  const response = await API.post("/darshans", darshanData);
  return response.data;
};

// Update Darshan
export const updateDarshan = async (id, darshanData) => {
  const response = await API.put(
    `/darshans/${id}`,
    darshanData
  );
  return response.data;
};

// Delete Darshan
export const deleteDarshan = async (id) => {
  const response = await API.delete(`/darshans/${id}`);
  return response.data;
};