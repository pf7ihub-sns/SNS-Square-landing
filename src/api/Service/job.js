import axiosInstance from './axiosInstance';

// Job API functions
export const jobAPI = {
  // Get all jobs with filters and pagination
  getAllJobs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/jobs?${queryString}` : '/jobs';
      
      const response = await axiosInstance.get(url);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch jobs',
        data: { jobs: [], pagination: {}, stats: {} }
      };
    }
  },

  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post('/jobs', jobData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error creating job:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create job',
        errors: error.response?.data?.errors || []
      };
    }
  }
};

export default jobAPI;
