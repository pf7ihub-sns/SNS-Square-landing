import { create } from "zustand";
import { loginUser, signUpUser } from "../api/Service/user";
import { setEncryptedItem, getEncryptedItem, removeEncryptedItem } from "../lib/encryption";

export const useAuthStore = create((set) => ({
  token: typeof window !== "undefined" ? getEncryptedItem("token") : null,
  userId: typeof window !== "undefined" ? getEncryptedItem("userId") : null,
  user: null,
  error: null,

  login: async (loginData) => {
    try {
      const { token, user, success } = await loginUser(loginData);

      if (success) {
        
        setEncryptedItem("token", token);
        setEncryptedItem("userId", user.id);
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
      setEncryptedItem("token", token);
      setEncryptedItem("userId", user.id);
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
    removeEncryptedItem("token");
    removeEncryptedItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("name");
    set({ user: null, token: null, userId: null });
  },

  clearError: () => {
    set({ error: null });
  },

  // Additional auth methods (e.g., Google) can be added here when available
}));