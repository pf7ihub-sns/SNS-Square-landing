import { create } from 'zustand';
import API from '../api/api.js';

const useNewsletterStore = create((set) => ({
  // State
  isLoading: false,
  isSuccess: false,
  error: null,
  message: '',

  // Actions
  subscribeToNewsletter: async (email) => {
    set({ isLoading: true, error: null, isSuccess: false, message: '' });
    
    try {
      const response = await API.post('/newsletter/subscribe', { email });
      
      set({
        isLoading: false,
        isSuccess: true,
        message: response.data.message || 'Successfully subscribed to newsletter!',
        error: null,
      });
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to subscribe. Please try again.';
      
      set({
        isLoading: false,
        isSuccess: false,
        error: errorMessage,
        message: '',
      });
      
      return { success: false, message: errorMessage };
    }
  },

  // Reset state
  resetState: () => {
    set({
      isLoading: false,
      isSuccess: false,
      error: null,
      message: '',
    });
  },
}));

export default useNewsletterStore;
