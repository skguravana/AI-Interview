import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

const userAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true });
    
            const response = await fetch("http://localhost:5000/aiinterview/auth/check-auth", {
                method: "GET",
                credentials: "include",
            });
    
            if (!response.ok) {
                set({ authUser: null });
                return;
            }
    
            const data = await response.json();
            set({ authUser: data });
        } catch (error) {
            console.error("Auth check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    

    signUp: async (formData) => {
        try {
            set({ isSigningUp: true });

            const response = await fetch("http://localhost:5000/aiinterview/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                set({ authUser: data });
                console.log("Sign-up successful:", data);
            } else {
                console.log("Sign-up failed:", data.message);
            }
        } catch (error) {
            console.error(error);
            set({ authUser: null });
        } finally {
            set({ isSigningUp: false });
        }
    },

    logIn: async (formData) => {
        try {
            set({ isLoggingIn: true });

            const response = await fetch("http://localhost:5000/aiinterview/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                set({ authUser: data });
                console.log("Login successful:", data);
            } else {
                console.log("Login failed:", data.message);
            }
        } catch (error) {
            console.error(error);
            set({ authUser: null });
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (formData) => {
        try {
            const response = await fetch("http://localhost:5000/aiinterview/user/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ bio: formData.bio, skills: formData.skills }),
            });

            const data = await response.json();
            if (response.ok) {
                set({ authUser: { ...userAuthStore.getState().authUser, bio: data.bio, skills: data.skills } });
                console.log("Profile updated successfully:", data);
            } else {
                console.error("Profile update failed:", data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    },

    getProfile:async()=>{

    },

    logOut: async () => {
        try {
            await fetch("http://localhost:5000/aiinterview/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            set({ authUser: null });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },

    // logOut: async (interviewId)=>{
    //         try {
    //           const result = await axios.get(
    //             `http://localhost:5000/aiinterview/interview/evalall`,
    //             { withCredentials: true } 
    //           );
    //           console.log('sai',result);
    //           set({interviewQuestions:result.data})
    //           return true;
    //         } catch (err) {
    //           console.error("Eval all:", err);
    //           return false;
    //         }
    //       },
}));

export default userAuthStore;
