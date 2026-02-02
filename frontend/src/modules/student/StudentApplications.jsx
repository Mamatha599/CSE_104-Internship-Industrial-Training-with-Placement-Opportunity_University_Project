import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student.api';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await studentAPI.getMyApplications();
      setApplications(response.data.data);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      approved: '#28a745',
      rejected: '#dc3545',
      shortlisted: '#17a2b8',
      interviewed: '#6f42c1',
      selected: '#28a745',
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h2>My Applications</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {applications.length === 0 ? (
        <p>No applications found. Start applying for opportunities!</p>
      ) : (
        <div>
          {applications.map((application) => (
            <div
              key={application._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>
                    {application.opportunity.title}
                  </h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Company:</strong> {application.opportunity.company}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Type:</strong> {application.opportunity.type}
                  </p>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                  {application.interviewDate && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Interview:</strong> {new Date(application.interviewDate).toLocaleDateString()}
                    </p>
                  )}
                  {application.feedback && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Feedback:</strong> {application.feedback}
                    </p>
                  )}
                </div>
                
                <div
                  style={{
                    padding: '5px 15px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(application.status),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {application.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;