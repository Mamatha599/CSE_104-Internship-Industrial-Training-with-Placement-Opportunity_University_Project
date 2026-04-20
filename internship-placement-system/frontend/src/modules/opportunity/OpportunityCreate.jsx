import { useState } from 'react';
import { opportunityAPI } from '../../api/opportunity.api';

const OpportunityCreate = () => {
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'internship', description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await opportunityAPI.create(formData);
      alert('Opportunity created successfully!');
      setFormData({title: '', company: '', location: '', type: 'internship', description: ''});
    } catch (error) {
      console.error('Failed to create opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-opportunity-container">
      <h2>Create New Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Company Name"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          required
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="internship">Internship</option>
          <option value="placement">Placement</option>
        </select>
        <textarea
          placeholder="Job Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Opportunity'}
        </button>
      </form>
    </div>
  );
};

export default OpportunityCreate;