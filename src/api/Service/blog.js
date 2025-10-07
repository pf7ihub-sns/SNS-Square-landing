import axiosInstance from "./axiosInstance";

export const fetchBlogs = async (params = {}) => {
  const res = await axiosInstance.get("blogs", { params });
  return res.data;
};

export const fetchBlogBySlug = async (slug) => {
  const res = await axiosInstance.get(`blogs/${slug}`);
  return res.data;
};


