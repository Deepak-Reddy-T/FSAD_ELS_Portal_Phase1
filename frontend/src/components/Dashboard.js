import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEquipment: 0,
    availableEquipment: 0,
    myRequests: 0,
    pendingRequests: 0,
    borrowedEquipment: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      if (user.role === 'ADMIN' || user.role === 'STAFF') {
        // Admin/Staff dashboard data
        const [equipmentRes, allRequestsRes] = await Promise.all([
          axios.get('/api/equipment/public/all'),
          axios.get('/api/requests/pending')
        ]);

        const totalEquipment = equipmentRes.data.length;
        const availableEquipment = equipmentRes.data.filter(eq => eq.availableQuantity > 0).length;
        const borrowedEquipment = totalEquipment - availableEquipment;
        const pendingRequestsCount = allRequestsRes.data.length;

        setStats({
          totalEquipment,
          availableEquipment,
          borrowedEquipment,
          myRequests: 0,
          pendingRequests: pendingRequestsCount
        });
        setPendingRequests(allRequestsRes.data);
      } else {
        // Student dashboard data
        const [equipmentRes, requestsRes] = await Promise.all([
          axios.get('/api/equipment/public/all'),
          axios.get('/api/requests/my-requests')
        ]);

        const totalEquipment = equipmentRes.data.length;
        const availableEquipment = equipmentRes.data.filter(eq => eq.availableQuantity > 0).length;
        const myRequests = requestsRes.data.length;
        const pendingRequestsCount = requestsRes.data.filter(req => req.status === 'PENDING').length;

        setStats({
          totalEquipment,
          availableEquipment,
          myRequests,
          pendingRequests: pendingRequestsCount,
          borrowedEquipment: 0
        });
      }
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="container">
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status" style={{ color: 'var(--primary-color)' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="mb-5">
        <h1 className="mb-2" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>
          Welcome back, {user.firstName}! 👋
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>
          Manage your equipment borrowing requests and track your items
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 text-center" style={{ border: '2px solid var(--primary-color)' }}>
            <div className="card-body">
              <div className="dashboard-stat" style={{ color: 'var(--primary-color)' }}>{stats.totalEquipment}</div>
              <div className="dashboard-label">Total Equipment</div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 text-center" style={{ border: '2px solid #28a745' }}>
            <div className="card-body">
              <div className="dashboard-stat" style={{ color: '#28a745' }}>{stats.availableEquipment}</div>
              <div className="dashboard-label">Available Now</div>
            </div>
          </div>
        </div>
        {user.role === 'ADMIN' || user.role === 'STAFF' ? (
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{ border: '2px solid #dc3545' }}>
              <div className="card-body">
                <div className="dashboard-stat" style={{ color: '#dc3545' }}>{stats.borrowedEquipment}</div>
                <div className="dashboard-label">Borrowed</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center" style={{ border: '2px solid #17a2b8' }}>
              <div className="card-body">
                <div className="dashboard-stat" style={{ color: '#17a2b8' }}>{stats.myRequests}</div>
                <div className="dashboard-label">My Requests</div>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 text-center" style={{ border: '2px solid #ffc107' }}>
            <div className="card-body">
              <div className="dashboard-stat" style={{ color: '#ffc107' }}>{stats.pendingRequests}</div>
              <div className="dashboard-label">{user.role === 'ADMIN' || user.role === 'STAFF' ? 'Pending Requests' : 'Pending'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid var(--border-color)' }}>
              <h5 className="mb-0" style={{ fontWeight: '600' }}>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/equipment')}
                >
                  📦 Browse Equipment
                </button>
                {user.role === 'ADMIN' ? (
                  <>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/admin/equipment')}
                    >
                      ⚙️ Manage Equipment
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/admin/requests')}
                    >
                      📋 Manage Requests
                    </button>
                  </>
                ) : user.role === 'STAFF' ? (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/admin/requests')}
                  >
                    📋 Manage Requests
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/requests')}
                  >
                    📋 View My Requests
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {user.role === 'ADMIN' || user.role === 'STAFF' ? (
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid var(--border-color)' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>Recent Pending Requests</h5>
              </div>
              <div className="card-body">
                {pendingRequests.length === 0 ? (
                  <p className="text-muted mb-0">No pending requests</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {pendingRequests.slice(0, 5).map(request => (
                      <div key={request.id} className="list-group-item px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1" style={{ fontWeight: '600' }}>{request.equipment.name}</h6>
                            <p className="mb-1 text-muted small">
                              Requested by: {request.user.firstName} {request.user.lastName}
                            </p>
                            <small className="text-muted">
                              Quantity: {request.quantity} | {new Date(request.requestDate).toLocaleDateString()}
                            </small>
                          </div>
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => navigate('/admin/requests')}
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header" style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid var(--border-color)' }}>
                <h5 className="mb-0" style={{ fontWeight: '600' }}>Account Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <strong style={{ color: 'var(--text-dark)' }}>Name:</strong>
                  <span className="ms-2" style={{ color: 'var(--text-light)' }}>{user.firstName} {user.lastName}</span>
                </div>
                <div className="mb-3">
                  <strong style={{ color: 'var(--text-dark)' }}>Username:</strong>
                  <span className="ms-2" style={{ color: 'var(--text-light)' }}>{user.username}</span>
                </div>
                <div className="mb-3">
                  <strong style={{ color: 'var(--text-dark)' }}>Email:</strong>
                  <span className="ms-2" style={{ color: 'var(--text-light)' }}>{user.email}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Role:</strong>
                  <span className={`badge ms-2 ${
                    user.role === 'ADMIN' ? 'bg-danger' : 
                    user.role === 'STAFF' ? 'bg-warning' : 'bg-primary'
                  }`} style={{ padding: '0.5rem 1rem', borderRadius: '20px' }}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
