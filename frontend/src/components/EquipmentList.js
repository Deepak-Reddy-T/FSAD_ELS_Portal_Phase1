import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const EquipmentList = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [requestData, setRequestData] = useState({
    quantity: 1,
    purpose: ''
  });

  const filterEquipment = useCallback(() => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, selectedCategory]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('/api/equipment/public/all');
      setEquipment(response.data);
    } catch (error) {
      setError('Failed to load equipment');
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/equipment/public/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchEquipment();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [filterEquipment]);

  const handleRequestEquipment = (item) => {
    setSelectedEquipment(item);
    setRequestData({
      quantity: 1,
      purpose: ''
    });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    try {
      await axios.post('/api/requests', {
        equipmentId: selectedEquipment.id,
        quantity: requestData.quantity,
        purpose: requestData.purpose
      });
      
      setShowRequestModal(false);
      setError('');
      alert('Request submitted successfully!');
      fetchEquipment(); // Refresh to update availability
    } catch (error) {
      setError(error.response?.data || 'Failed to submit request');
    }
  };

  const getAvailabilityBadge = (item) => {
    if (item.availableQuantity === 0) {
      return <span className="badge bg-danger">Unavailable</span>;
    } else if (item.availableQuantity < item.quantity) {
      return <span className="badge bg-warning">Limited</span>;
    } else {
      return <span className="badge bg-success">Available</span>;
    }
  };

  const getConditionBadge = (condition) => {
    const colors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Fair': 'warning',
      'Poor': 'danger'
    };
    return <span className={`badge bg-${colors[condition] || 'secondary'}`}>{condition}</span>;
  };

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
          Equipment Catalog 📦
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-light)' }}>
          Browse and request equipment for your needs
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card mb-4" style={{ padding: '1.5rem' }}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" style={{ fontWeight: '500' }}>Search Equipment</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={{ fontWeight: '500' }}>Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button 
              className="btn btn-outline-primary w-100"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredEquipment.map(item => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0" style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{item.name}</h5>
                  {getAvailabilityBadge(item)}
                </div>
                
                <div className="mb-2">
                  <strong style={{ color: 'var(--text-dark)' }}>Category:</strong>
                  <span className="ms-2" style={{ color: 'var(--text-light)' }}>{item.category}</span>
                </div>
                
                <div className="mb-2">
                  <strong style={{ color: 'var(--text-dark)' }}>Condition:</strong>
                  <span className="ms-2">{getConditionBadge(item.condition)}</span>
                </div>
                
                <div className="mb-3">
                  <strong style={{ color: 'var(--text-dark)' }}>Available:</strong>
                  <span className="ms-2" style={{ color: 'var(--text-light)' }}>{item.availableQuantity} / {item.quantity}</span>
                </div>
                
                {item.description && (
                  <p className="text-muted small mb-3" style={{ lineHeight: '1.5' }}>
                    {item.description}
                  </p>
                )}
                
                {user.role !== 'ADMIN' && user.role !== 'STAFF' && (
                  <button
                    className="btn btn-primary w-100"
                    disabled={item.availableQuantity === 0}
                    onClick={() => handleRequestEquipment(item)}
                  >
                    {item.availableQuantity === 0 ? 'Not Available' : 'Request Equipment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center mt-5">
          <h4 style={{ color: 'var(--text-dark)' }}>No equipment found</h4>
          <p className="text-muted">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ fontWeight: '600' }}>Request Equipment</h5>
                <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedEquipment && (
                  <>
                    <h6 style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{selectedEquipment.name}</h6>
                    <p className="text-muted">Available: {selectedEquipment.availableQuantity}</p>
                    
                    <div className="mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        max={selectedEquipment.availableQuantity}
                        value={requestData.quantity}
                        onChange={(e) => setRequestData({
                          ...requestData,
                          quantity: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Purpose</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe the purpose of borrowing this equipment..."
                        value={requestData.purpose}
                        onChange={(e) => setRequestData({
                          ...requestData,
                          purpose: e.target.value
                        })}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-primary" onClick={() => setShowRequestModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmitRequest}>
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;
