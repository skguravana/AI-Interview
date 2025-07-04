import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import userAuthStore from "./store/userauthstore";
import UserLayout from "./components/UserLayout"; 
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Feedback from "./pages/Feedback";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Contact from './pages/Contact'

// Admin imports
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminComplaints from "./pages/admin/Complaints";

export default function App() {
  const { authUser, checkAuth } = userAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints" element={<AdminComplaints/>}/>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* User Routes with Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={authUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="signup" element={authUser ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="dashboard" element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="interview" element={authUser ? <Interview /> : <Navigate to="/login" />} />
          <Route path="findpeople" element={authUser ? <Community /> : <Navigate to="/login" />} />
          <Route path="contact" element={authUser ? <Contact /> : <Navigate to="/login" />} />
          <Route path="feedback/:userId/:interviewId" element={authUser ? <Feedback /> : <Navigate to="/login" />} />
          <Route path="profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
