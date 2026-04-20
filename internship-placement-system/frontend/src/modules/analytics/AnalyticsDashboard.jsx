import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../api/analytics.api';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      {analytics ? (
        <div className="analytics-grid">
          <div className="chart-container">
            <h3>Placement Statistics</h3>
            <p>Placement Rate: {analytics.placementRate}%</p>
          </div>
          <div className="chart-container">
            <h3>Application Trends</h3>
            <p>Total Applications: {analytics.totalApplications}</p>
          </div>
          <div className="chart-container">
            <h3>Department Wise Stats</h3>
            <p>Top Department: {analytics.topDepartment}</p>
          </div>
        </div>
      ) : (
        <p>No analytics data available</p>
      )}
    </div>
  );
};

export default AnalyticsDashboard;