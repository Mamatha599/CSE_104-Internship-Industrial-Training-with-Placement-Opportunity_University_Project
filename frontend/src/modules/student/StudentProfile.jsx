import React, { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student.api';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setProfile(response.data.data);
      setFormData(response.data.data.profile);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skills') {
      setFormData({
        ...formData,
        [name]: value.split(',').map(skill => skill.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await studentAPI.updateProfile(formData);
      setSuccess('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>My Profile</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

      {!editing ? (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Name:</strong> {profile?.profile?.firstName} {profile?.profile?.lastName}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Email:</strong> {profile?.email}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Student ID:</strong> {profile?.profile?.studentId}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Department:</strong> {profile?.profile?.department}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Year:</strong> {profile?.profile?.year}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>CGPA:</strong> {profile?.profile?.cgpa || 'Not set'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Skills:</strong> {profile?.profile?.skills?.join(', ') || 'None'}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Phone:</strong> {profile?.profile?.phone || 'Not set'}
          </div>
          
          <button
            onClick={() => setEditing(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Year:</label>
            <select
              name="year"
              value={formData.year || 1}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>CGPA:</label>
            <input
              type="number"
              name="cgpa"
              min="0"
              max="10"
              step="0.01"
              value={formData.cgpa || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Skills (comma-separated):</label>
            <input
              type="text"
              name="skills"
              value={formData.skills?.join(', ') || ''}
              onChange={handleChange}
              placeholder="JavaScript, React, Node.js"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginRight: '10px',
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            
            <button
              type="button"
              onClick={() => setEditing(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;