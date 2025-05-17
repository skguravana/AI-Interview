import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import useAdminStore from '../store/adminStore';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, logout } = useAdminStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  // Show only login page without layout
  if (!admin && location.pathname === '/admin/login') {
    return <Outlet />;
  }

  // Block other pages if not logged in
  if (!admin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-full shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
        </div>

        <nav className="flex-1 mt-6 space-y-1 px-2">
          <SidebarLink to="/admin/dashboard" active={isActive('/admin/dashboard')} icon={<LayoutDashboard size={20} />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/admin/users" active={isActive('/admin/users')} icon={<Users size={20} />}>
            Manage Users
          </SidebarLink>

          <SidebarLink to="/admin/complaints" active={isActive('/admin/complaints')} icon={<ShieldAlert size={20} />}>
            Complaints
          </SidebarLink>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 w-full p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// SidebarLink component for clean, reusable links
function SidebarLink({ to, active, icon, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors ${
        active ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
