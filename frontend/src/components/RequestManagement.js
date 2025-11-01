import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests/all');
      setRequests(response.data);
    } catch (error) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminNotes('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setActionType('');
    setAdminNotes('');
  };

  const handleSubmitAction = async () => {
    try {
      let endpoint = '';
      let data = adminNotes;

      switch (actionType) {
        case 'approve':
          endpoint = `/api/requests/${selectedRequest.id}/approve`;
          break;
        case 'reject':
          endpoint = `/api/requests/${selectedRequest.id}/reject`;
          break;
        case 'borrowed':
          endpoint = `/api/requests/${selectedRequest.id}/borrowed`;
          data = null;
          break;
        case 'returned':
          endpoint = `/api/requests/${selectedRequest.id}/returned`;
          data = null;
          break;
        default:
          throw new Error('Invalid action');
      }

      await axios.put(endpoint, data);
      setSuccess(`Request ${actionType} successfully`);
      handleCloseModal();
      fetchRequests();
    } catch (error) {
      setError(error.response?.data || 'Failed to process request');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'warning', text: 'Pending' },
      'APPROVED': { bg: 'info', text: 'Approved' },
      'REJECTED': { bg: 'danger', text: 'Rejected' },
      'BORROWED': { bg: 'primary', text: 'Borrowed' },
      'RETURNED': { bg: 'success', text: 'Returned' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getActionButtons = (request) => {
    const buttons = [];

    switch (request.status) {
      case 'PENDING':
        buttons.push(
          <Button
            key="approve"
            variant="success"
            size="sm"
            className="me-1"
            onClick={() => handleAction(request, 'approve')}
            style={{ 
              minWidth: '85px',
              fontSize: '0.9rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '40px'
            }}
          >
            Approve
          </Button>
        );
        buttons.push(
          <Button
            key="reject"
            variant="danger"
            size="sm"
            onClick={() => handleAction(request, 'reject')}
            style={{ 
              minWidth: '85px',
              fontSize: '0.9rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '40px'
            }}
          >
            Reject
          </Button>
        );
        break;
      case 'APPROVED':
        buttons.push(
          <Button
            key="borrowed"
            variant="outline-primary"
            size="sm"
            onClick={() => handleAction(request, 'borrowed')}
          >
            Mark as Borrowed
          </Button>
        );
        break;
      case 'BORROWED':
        buttons.push(
          <Button
            key="returned"
            variant="outline-primary"
            size="sm"
            onClick={() => handleAction(request, 'returned')}
          >
            Mark as Returned
          </Button>
        );
        break;
      default:
        buttons.push(
          <span key="no-action" className="text-muted">No actions available</span>
        );
    }

    return buttons;
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
        <h1 className="page-title" style={{ whiteSpace: 'nowrap' }}>Request Management</h1>
        <p className="page-subtitle">Review and manage equipment borrowing requests</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-warning">
                {requests.filter(req => req.status === 'PENDING').length}
              </h4>
              <p className="mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-info">
                {requests.filter(req => req.status === 'APPROVED').length}
              </h4>
              <p className="mb-0">Approved</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">
                {requests.filter(req => req.status === 'BORROWED').length}
              </h4>
              <p className="mb-0">Borrowed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-success">
                {requests.filter(req => req.status === 'RETURNED').length}
              </h4>
              <p className="mb-0">Returned</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">All Requests</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User</th>
                  <th>Equipment</th>
                  <th>Quantity</th>
                  <th>Purpose</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>
                      <strong>{request.user.firstName} {request.user.lastName}</strong>
                      <div className="text-muted small">{request.user.username}</div>
                    </td>
                    <td>
                      <strong>{request.equipment.name}</strong>
                      <div className="text-muted small">{request.equipment.category}</div>
                    </td>
                    <td>{request.quantity}</td>
                    <td>
                      {request.purpose ? (
                        <span title={request.purpose}>
                          {request.purpose.length > 30 
                            ? `${request.purpose.substring(0, 30)}...` 
                            : request.purpose
                          }
                        </span>
                      ) : (
                        <span className="text-muted">No purpose specified</span>
                      )}
                    </td>
                    <td>{formatDate(request.requestDate)}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {getActionButtons(request)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Action Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === 'approve' && 'Approve Request'}
            {actionType === 'reject' && 'Reject Request'}
            {actionType === 'borrowed' && 'Mark as Borrowed'}
            {actionType === 'returned' && 'Mark as Returned'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <>
              <h6>Request Details</h6>
              <p><strong>User:</strong> {selectedRequest.user.firstName} {selectedRequest.user.lastName}</p>
              <p><strong>Equipment:</strong> {selectedRequest.equipment.name}</p>
              <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
              <p><strong>Purpose:</strong> {selectedRequest.purpose || 'Not specified'}</p>
              
              {(actionType === 'approve' || actionType === 'reject') && (
                <Form.Group className="mt-3">
                  <Form.Label>Admin Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes for the user..."
                  />
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button 
            variant={
              actionType === 'approve' ? 'success' :
              actionType === 'reject' ? 'danger' : 'primary'
            }
            onClick={handleSubmitAction}
          >
            {actionType === 'approve' && 'Approve Request'}
            {actionType === 'reject' && 'Reject Request'}
            {actionType === 'borrowed' && 'Mark as Borrowed'}
            {actionType === 'returned' && 'Mark as Returned'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RequestManagement;
