import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/analytics.api';

const PlacementDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Placement Cell Dashboard</h2>
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
          <div className="stat-card">
            <h3>Active Opportunities</h3>
            <p>{stats.activeOpportunities}</p>
          </div>
          <div className="stat-card">
            <h3>Placed Students</h3>
            <p>{stats.placedStudents}</p>
          </div>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default PlacementDashboard;