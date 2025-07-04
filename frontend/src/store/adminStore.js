import { create } from 'zustand';

const useAdminStore = create((set) => ({
  admin: null,
  dashboardStats: null,
  users: [],
  selectedUser: null,
  complaints: [],
  isLoading: false,
  error: null,

  loginAdmin: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("http://localhost:5000/aiinterview/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });

      const data = await response.json();
      if (response.ok) {
        set({ admin: data });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      set({ error: "Login failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDashboardStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("http://localhost:5000/aiinterview/admin/dashboard-stats", {
        credentials: "include"
      });
      
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        set({ dashboardStats: data });
      }
    } catch (error) {
      set({ error: "Failed to fetch dashboard stats" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("http://localhost:5000/aiinterview/admin/users", {
        credentials: "include"
      });
      
      const data = await response.json();
      if (response.ok) {
        set({ users: data });
      }
    } catch (error) {
      set({ error: "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`http://localhost:5000/aiinterview/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      if (response.ok) {
        set(state => ({
          users: state.users.filter(user => user._id !== userId)
        }));
      }
    } catch (error) {
      set({ error: "Failed to delete user" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserDetails: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`http://localhost:5000/aiinterview/admin/users/${userId}`, {
        credentials: "include"
      });
      
      const data = await response.json();
      if (response.ok) {
        set({ selectedUser: data });
      }
    } catch (error) {
      set({ error: "Failed to fetch user details" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchComplaints: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("http://localhost:5000/aiinterview/admin/complaints", {
        credentials: "include"
      });
      
      const data = await response.json();
      if (response.ok) {
        set({ complaints: data });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      set({ error: "Failed to fetch complaints" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateComplaint: async (complaintId, { status, adminResponse }) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`http://localhost:5000/aiinterview/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminResponse }),
        credentials: "include"
      });
      
      const updatedComplaint = await response.json();
      if (response.ok) {
        set(state => ({
          complaints: state.complaints.map(complaint =>
            complaint._id === complaintId ? updatedComplaint : complaint
          )
        }));
      }
    } catch (error) {
      set({ error: "Failed to update complaint" });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ admin: null, dashboardStats: null, users: [], selectedUser: null, complaints: [] });
  }
}));

export default useAdminStore;