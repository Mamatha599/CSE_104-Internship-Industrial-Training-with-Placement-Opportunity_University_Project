import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student.api';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all');
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, [filter]);

  const fetchOpportunities = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await studentAPI.getOpportunities(params);
      setOpportunities(response.data.data.opportunities);
    } catch (err) {
      setError('Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId) => {
    const coverLetter = prompt('Enter a brief cover letter (optional):');
    
    setApplying(opportunityId);
    setError('');
    setSuccess('');

    try {
      await studentAPI.applyForOpportunity({
        opportunityId,
        coverLetter: coverLetter || '',
      });
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return <div>Loading opportunities...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <h2>Available Opportunities</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by type:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="all">All</option>
          <option value="internship">Internships</option>
          <option value="placement">Placements</option>
        </select>
      </div>

      {opportunities.length === 0 ? (
        <p>No opportunities available at the moment.</p>
      ) : (
        <div>
          {opportunities.map((opportunity) => (
            <div
              key={opportunity._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {opportunity.title}
                  </h3>
                  
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Company:</strong> {opportunity.company}
                  </p>
                  
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '15px',
                      backgroundColor: opportunity.type === 'internship' ? '#e3f2fd' : '#f3e5f5',
                      color: opportunity.type === 'internship' ? '#1976d2' : '#7b1fa2',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      margin: '10px 0',
                    }}
                  >
                    {opportunity.type}
                  </div>
                  
                  <p style={{ margin: '10px 0', color: '#555' }}>
                    {opportunity.description}
                  </p>
                  
                  {opportunity.details.location && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Location:</strong> {opportunity.details.location} ({opportunity.details.mode})
                    </p>
                  )}
                  
                  {opportunity.details.duration && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Duration:</strong> {opportunity.details.duration}
                    </p>
                  )}
                  
                  {opportunity.details.stipend && (
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Stipend:</strong> ₹{opportunity.details.stipend}
                    </p>
                  )}
                  
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Application Deadline:</strong> {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                  </p>
                  
                  {opportunity.requirements.skills.length > 0 && (
                    <div style={{ margin: '10px 0' }}>
                      <strong>Required Skills:</strong>
                      <div style={{ marginTop: '5px' }}>
                        {opportunity.requirements.skills.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              margin: '2px',
                              backgroundColor: '#f0f0f0',
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ marginLeft: '20px' }}>
                  <button
                    onClick={() => handleApply(opportunity._id)}
                    disabled={applying === opportunity._id}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: applying === opportunity._id ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: applying === opportunity._id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {applying === opportunity._id ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OpportunityList;