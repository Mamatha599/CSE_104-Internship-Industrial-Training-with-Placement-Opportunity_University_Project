import { useState, useEffect } from 'react';
import { opportunityAPI } from '../../api/opportunity.api';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await opportunityAPI.getAll();
        setOpportunities(response.data);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="opportunities-container">
      <h2>Available Opportunities</h2>
      {opportunities.length > 0 ? (
        <div className="opportunities-grid">
          {opportunities.map((opp, index) => (
            <div key={index} className="opportunity-card">
              <h3>{opp.title}</h3>
              <p>{opp.company}</p>
              <p>{opp.location}</p>
              <p>Type: {opp.type}</p>
              <button>Apply Now</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No opportunities available</p>
      )}
    </div>
  );
};

export default OpportunityList;