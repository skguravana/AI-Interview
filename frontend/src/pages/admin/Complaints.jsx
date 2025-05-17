import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAdminStore from '../../store/adminStore';

export default function AdminComplaints() {
  const { admin, complaints, fetchComplaints, updateComplaint, isLoading } = useAdminStore();
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (admin) {
      fetchComplaints();
    }
  }, [admin]);

  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  const filteredComplaints =
    selectedStatus === 'all'
      ? complaints || []
      : (complaints || []).filter(complaint => complaint.status === selectedStatus);

  const handleStatusUpdate = async (complaintId, status, adminResponse) => {
    await updateComplaint(complaintId, { status, adminResponse });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complaints Management</h1>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Complaints</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Complaints List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-4">Loading complaints...</div>
          ) : !filteredComplaints || filteredComplaints.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No complaints found</div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{complaint.subject}</h3>
                    <p className="text-sm text-gray-500">
                      From: {complaint.userId?.fullName} ({complaint.userId?.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(complaint.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{complaint.message}</p>
                </div>

                {complaint.adminResponse && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Response:</h4>
                    <p className="text-gray-700">{complaint.adminResponse}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      handleStatusUpdate(complaint._id, e.target.value, complaint.adminResponse)
                    }
                    className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Add response..."
                    value={complaint.adminResponse || ''}
                    onChange={(e) =>
                      handleStatusUpdate(complaint._id, complaint.status, e.target.value)
                    }
                    className="flex-1 px-3 py-1 rounded-lg border border-gray-300 text-sm"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
