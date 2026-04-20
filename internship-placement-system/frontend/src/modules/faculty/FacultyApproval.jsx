import { useState, useEffect } from 'react';
import { applicationAPI } from '../../api/application.api';

const FacultyApproval = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationAPI.getAll();
        setApplications(response.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await applicationAPI.updateStatus(id, status);
      setApplications(apps => 
        apps.map(app => app.id === id ? {...app, status} : app)
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="approval-container">
      <h2>Faculty Approval</h2>
      {applications.map((app, index) => (
        <div key={index} className="approval-card">
          <h3>{app.studentName}</h3>
          <p>Opportunity: {app.opportunityTitle}</p>
          <p>Status: {app.status}</p>
          <div>
            <button onClick={() => handleApproval(app.id, 'approved')}>
              Approve
            </button>
            <button onClick={() => handleApproval(app.id, 'rejected')}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacultyApproval;