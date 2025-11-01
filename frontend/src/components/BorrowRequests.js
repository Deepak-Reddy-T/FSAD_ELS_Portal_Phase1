import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      console.group('API Request Debugging');
      console.log('Making request to /api/requests/my-requests');
      
      const response = await axios.get('/api/requests/my-requests');
      console.log('API Response received. Status:', response.status);
      
      // Log the raw response data structure
      console.log('Response data structure:', Object.keys(response.data).length > 0 ? Object.keys(response.data[0]) : 'Empty response');
      
      // Log each request with its date information
      if (response.data && response.data.length > 0) {
        response.data.forEach((request, index) => {
          console.group(`Request ${index}`);
          console.log('Full request object:', request);
          console.log('requestDate:', request.requestDate);
          console.log('Type of requestDate:', typeof request.requestDate);
          
          if (request.requestDate) {
            console.log('Date constructor test:', new Date(request.requestDate).toString());
            console.log('Date parse test:', new Date(Date.parse(request.requestDate)));
          }
          
          console.groupEnd();
        });
      } else {
        console.log('No requests found in response');
      }
      
      console.groupEnd();
      setRequests(response.data);
    } catch (error) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
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

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    try {
      let date;
      
     
      if (dateInput instanceof Date) {
        date = dateInput;
      } 
     
      else if (typeof dateInput === 'string') {
        
        date = new Date(dateInput);
        
        
        if (isNaN(date.getTime())) {
          // Trying ISO format without timezone
          const isoMatch = dateInput.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
          if (isoMatch) {
            date = new Date(isoMatch[0]);
          }
          
          // Trying space-separated format
          if (isNaN(date.getTime())) {
            const spaceMatch = dateInput.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
            if (spaceMatch) {
              date = new Date(spaceMatch[0].replace(' ', 'T'));
            }
          }
        }
      } 
      
      else if (typeof dateInput === 'number') {
        date = new Date(dateInput);
      }
      
      
      if (date && !isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(date);
      }
      
      
      console.warn('Could not parse date:', dateInput);
      return 'N/A';
      
    } catch (error) {
      console.error('Error formatting date:', error, 'Input was:', dateInput);
      return 'N/A';
    }
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
        <h1 className="page-title">My Borrow Requests</h1>
        <p className="page-subtitle">Track the status of your equipment borrowing requests</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4 className="text-primary">{requests.length}</h4>
              <p className="mb-0">Total Requests</p>
            </Card.Body>
          </Card>
        </Col>
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
                {requests.filter(req => req.status === 'APPROVED' || req.status === 'BORROWED').length}
              </h4>
              <p className="mb-0">Approved</p>
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
          <h5 className="mb-0">Request History</h5>
        </Card.Header>
        <Card.Body>
          {requests.length === 0 ? (
            <div className="text-center py-4">
              <h5>No requests found</h5>
              <p className="text-muted">You haven't made any equipment requests yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Purpose</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.equipment.name}</strong>
                      </td>
                      <td>
                        <Badge bg="secondary">{request.equipment.category}</Badge>
                      </td>
                      <td>{request.quantity}</td>
                      <td>
                        {request.purpose ? (
                          <span title={request.purpose}>
                            {request.purpose.length > 50 
                              ? `${request.purpose.substring(0, 50)}...` 
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
                        {request.adminNotes ? (
                          <span title={request.adminNotes}>
                            {request.adminNotes.length > 30 
                              ? `${request.adminNotes.substring(0, 30)}...` 
                              : request.adminNotes
                            }
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BorrowRequests;
