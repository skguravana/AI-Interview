import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import useAdminStore from '../../store/adminStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const { admin, dashboardStats, fetchDashboardStats, isLoading } = useAdminStore();

  useEffect(() => {
    if (admin) {
      fetchDashboardStats();
    }
  }, [admin]);

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  if (
    isLoading ||
    !dashboardStats ||
    !dashboardStats.userRegistrationsByDate ||
    !dashboardStats.interviewsByDate
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Prepare data for registration trend chart
  const registrationChartData = {
    labels: dashboardStats.userRegistrationsByDate?.map(data =>
      new Date(data._id).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'User Registrations',
        data: dashboardStats.userRegistrationsByDate?.map(data => data.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  // Prepare data for interview trend chart
  const interviewChartData = {
    labels: dashboardStats.interviewsByDate?.map(data =>
      new Date(data._id).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Interviews',
        data: dashboardStats.interviewsByDate?.map(data => data.count) || [],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        tension: 0.4
      },
      {
        label: 'Average Score',
        data: dashboardStats.interviewsByDate?.map(data => data.averageScore) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.4,
        yAxisID: 'score'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      },
      score: {
        position: 'right',
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Interviews</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardStats.totalInterviews}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Average Score</h3>
            <p className="text-3xl font-bold text-green-600">
              {Math.round(dashboardStats.interviewStats.averageScore)}%
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Registration Trend</h2>
            <div className="h-[400px]">
              <Line data={registrationChartData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Statistics</h2>
            <div className="h-[400px]">
              <Line data={interviewChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardStats.recentUsers?.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
