import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import components (these will be created later)
import StudentLogin from '../modules/student/StudentLogin';
import StudentRegister from '../modules/student/StudentRegister';
import StudentProfile from '../modules/student/StudentProfile';
import StudentApplications from '../modules/student/StudentApplications';
import PlacementDashboard from '../modules/placement-cell/PlacementDashboard';
import FacultyApproval from '../modules/faculty/FacultyApproval';
import RecruiterDashboard from '../modules/recruiter/RecruiterDashboard';
import OpportunityList from '../modules/opportunity/OpportunityList';
import OpportunityCreate from '../modules/opportunity/OpportunityCreate';
import AnalyticsDashboard from '../modules/analytics/AnalyticsDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<StudentLogin />} />
      <Route path="/register" element={<StudentRegister />} />
      
      {/* Student Routes */}
      <Route 
        path="/student/profile" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/applications" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentApplications />
          </ProtectedRoute>
        } 
      />
      
      {/* Placement Cell Routes */}
      <Route 
        path="/placement/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['placement_cell']}>
            <PlacementDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Faculty Routes */}
      <Route 
        path="/faculty/approvals" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyApproval />
          </ProtectedRoute>
        } 
      />
      
      {/* Recruiter Routes */}
      <Route 
        path="/recruiter/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Opportunity Routes */}
      <Route 
        path="/opportunities" 
        element={
          <ProtectedRoute>
            <OpportunityList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/opportunities/create" 
        element={
          <ProtectedRoute allowedRoles={['placement_cell', 'recruiter']}>
            <OpportunityCreate />
          </ProtectedRoute>
        } 
      />
      
      {/* Analytics Routes */}
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute allowedRoles={['placement_cell', 'admin']}>
            <AnalyticsDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/opportunities" replace />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;