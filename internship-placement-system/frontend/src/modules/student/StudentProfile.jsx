import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student.api';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentAPI.getProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Student Profile</h2>
      {profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Student ID: {profile.studentId}</p>
          <p>Department: {profile.department}</p>
        </div>
      ) : (
        <p>Profile not found</p>
      )}
    </div>
  );
};

export default StudentProfile;