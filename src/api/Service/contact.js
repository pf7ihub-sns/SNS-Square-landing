import axiosInstance from "./axiosInstance";

export const submitContactEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/enquiry", { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    throw new Error(errorMessage);
  }
};


