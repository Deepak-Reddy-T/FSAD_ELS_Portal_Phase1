import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import EquipmentList from './components/EquipmentList';
import BorrowRequests from './components/BorrowRequests';
import EquipmentManagement from './components/EquipmentManagement';
import RequestManagement from './components/RequestManagement';
import './App.css';

function ProtectedRoute({ children, requiredRole, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/equipment" element={
        <ProtectedRoute>
          <EquipmentList />
        </ProtectedRoute>
      } />
      <Route path="/requests" element={
        <ProtectedRoute>
          {user?.role === 'STUDENT' ? <BorrowRequests /> : <Navigate to="/dashboard" />}
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/equipment" element={
        <ProtectedRoute requiredRole="ADMIN">
          <EquipmentManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/requests" element={
        <ProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
          <RequestManagement />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container-fluid py-4">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
