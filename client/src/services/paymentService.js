import API from "./api";

// ===============================
// Make Payment
// ===============================

export const makePayment = async (paymentData) => {
  try {
    const response = await API.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Payment Failed",
      }
    );
  }
};

// ===============================
// Payment History
// ===============================

export const getPaymentHistory = async () => {
  try {
    const response = await API.get("/payments");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Unable to fetch payment history",
      }
    );
  }
};

// ===============================
// Payment Details
// ===============================

export const getPaymentById = async (id) => {
  try {
    const response = await API.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Payment not found",
      }
    );
  }
};