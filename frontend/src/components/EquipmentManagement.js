import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    condition: 'Good',
    quantity: 1,
    description: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

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

  const handleShowModal = (item = null) => {
    if (item) {
      setEditingEquipment(item);
      setFormData({
        name: item.name,
        category: item.category,
        condition: item.condition,
        quantity: item.quantity,
        description: item.description || ''
      });
    } else {
      setEditingEquipment(null);
      setFormData({
        name: '',
        category: '',
        condition: 'Good',
        quantity: 1,
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEquipment(null);
    setFormData({
      name: '',
      category: '',
      condition: 'Good',
      quantity: 1,
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingEquipment) {
        await axios.put(`/api/equipment/${editingEquipment.id}`, formData);
        setSuccess('Equipment updated successfully');
      } else {
        await axios.post('/api/equipment', formData);
        setSuccess('Equipment added successfully');
      }
      
      handleCloseModal();
      fetchEquipment();
    } catch (error) {
      setError(error.response?.data || 'Failed to save equipment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await axios.delete(`/api/equipment/${id}`);
        setSuccess('Equipment deleted successfully');
        fetchEquipment();
      } catch (error) {
        setError(error.response?.data || 'Failed to delete equipment');
      }
    }
  };

  const getAvailabilityBadge = (item) => {
    if (item.availableQuantity === 0) {
      return <Badge bg="danger">Unavailable</Badge>;
    } else if (item.availableQuantity < item.quantity) {
      return <Badge bg="warning">Limited</Badge>;
    } else {
      return <Badge bg="success">Available</Badge>;
    }
  };

  const getConditionBadge = (condition) => {
    const colors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Fair': 'warning',
      'Poor': 'danger'
    };
    return <Badge bg={colors[condition] || 'secondary'}>{condition}</Badge>;
  };

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="page-header">
        <h1 className="page-title" style={{ whiteSpace: 'nowrap' }}>Equipment Management</h1>
        <p className="page-subtitle">Add, edit, and manage school equipment</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Equipment List ({equipment.length} items)</h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add New Equipment
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Condition</th>
                  <th>Total Qty</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map(item => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.description && (
                        <div className="text-muted small">{item.description}</div>
                      )}
                    </td>
                    <td>
                      <Badge bg="secondary">{item.category}</Badge>
                    </td>
                    <td>{getConditionBadge(item.condition)}</td>
                    <td>{item.quantity}</td>
                    <td>{item.availableQuantity}</td>
                    <td>{getAvailabilityBadge(item)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Equipment Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Enter equipment name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    placeholder="e.g., Sports, Lab, Music"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Condition *</Form.Label>
                  <Form.Select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter equipment description (optional)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingEquipment ? 'Update Equipment' : 'Add Equipment'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default EquipmentManagement;
