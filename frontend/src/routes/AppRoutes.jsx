import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Components
import StudentLogin from '../modules/student/StudentLogin';
import StudentRegister from '../modules/student/StudentRegister';
import StudentProfile from '../modules/student/StudentProfile';
import StudentApplications from '../modules/student/StudentApplications';
import OpportunityList from '../modules/opportunity/OpportunityList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <nav style={{
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3>Student Dashboard</h3>
        <div>
          <span style={{ marginRight: '20px' }}>
            Welcome, {user?.profile?.firstName}!
          </span>
          <button
            onClick={logout}
            style={{
              padding: '5px 15px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <a href="/profile" style={{ marginRight: '20px' }}>Profile</a>
          <a href="/opportunities" style={{ marginRight: '20px' }}>Opportunities</a>
          <a href="/applications">My Applications</a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Welcome to the Internship & Placement Portal</h2>
          <p>Use the navigation above to manage your profile, browse opportunities, and track applications.</p>
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities"
          element={
            <ProtectedRoute>
              <OpportunityList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <StudentApplications />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;