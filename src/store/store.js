import { create } from "zustand";
import { loginUser, signUpUser } from "../api/Service/user";

export const useAuthStore = create((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
  user: null,
  error: null,

  login: async (loginData) => {
    try {
      const { token, user, success } = await loginUser(loginData);

      if (success) {
        
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("name", user.name);

        set({
          token,
          userId: user.id,
          user,
          error: null,
        });
      }

      return { success };
    } catch (error) {
      set({ error: error.message || "An error occurred" });
      return { success: false, error: error.message || "An error occurred" };
    }
  },

  signUp: async (signUpData) => {
    try {
      const { message, token, user, success } = await signUpUser(signUpData);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("name", user.name);
      localStorage.setItem("userEmail", user.email);
      set({ token, userId: user.id, user, error: null });
      return { success, message };
    } catch (error) {
      set({ error: error.message || "An error occurred" });
      return { success: false, error: error.message || "An error occurred" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("name");
    set({ user: null, token: null, userId: null });
  },

  clearError: () => {
    set({ error: null });
  },

  // Additional auth methods (e.g., Google) can be added here when available
}));