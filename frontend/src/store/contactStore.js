import { create } from 'zustand';

const useContactStore = create((set) => ({
  contacts: [],
  isSubmitting: false,
  error: null,

  submitContact: async (formData) => {
    try {
      set({ isSubmitting: true, error: null });
      const response = await fetch("http://localhost:5000/aiinterview/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }

      return true;
    } catch (error) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchUserContacts: async () => {
    try {
      const response = await fetch("http://localhost:5000/aiinterview/contact/history", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch contact history");
      }

      const data = await response.json();
      set({ contacts: data });
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

export default useContactStore;