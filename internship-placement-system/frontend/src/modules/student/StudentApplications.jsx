import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student.api';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await studentAPI.getApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="applications-container">
      <h2>My Applications</h2>
      {applications.length > 0 ? (
        <div>
          {applications.map((app, index) => (
            <div key={index} className="application-card">
              <h3>{app.opportunityTitle}</h3>
              <p>Status: {app.status}</p>
              <p>Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No applications found</p>
      )}
    </div>
  );
};

export default StudentApplications;