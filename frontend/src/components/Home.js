import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EmailModal from './EmailModal';
import './Home.css';

const Home = () => {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedRecordForEmail, setSelectedRecordForEmail] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    companyProfileLink: '',
    hrName: '',
    hrProfileLink: '',
    hrEmail: '',
    hrPhone: '',
    active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [selectedCompany, records]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, companiesRes] = await Promise.all([
        api.get('/hr'),
        api.get('/companies')
      ]);
      setRecords(recordsRes.data);
      setFilteredRecords(recordsRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    if (!selectedCompany) {
      setFilteredRecords(records);
    } else {
      const filtered = records.filter(
        record => record.companyName.toLowerCase().includes(selectedCompany.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      companyProfileLink: '',
      hrName: '',
      hrProfileLink: '',
      hrEmail: '',
      hrPhone: '',
      active: true
    });
    setError('');
  };

  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditClick = (record) => {
    setFormData({
      companyName: record.companyName,
      companyProfileLink: record.companyProfileLink || '',
      hrName: record.hrName,
      hrProfileLink: record.hrProfileLink || '',
      hrEmail: record.hrEmail,
      hrPhone: record.hrPhone,
      active: record.active
    });
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleEmailClick = (record) => {
    setSelectedRecordForEmail(record);
    setShowEmailModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.hrName.trim()) {
      setError('HR name is required');
      return false;
    }
    if (!formData.hrEmail.trim()) {
      setError('HR email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.hrEmail.trim())) {
      setError('Invalid email format');
      return false;
    }
    // HR phone is optional; validate only if provided
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.hrPhone && formData.hrPhone.trim() !== '' && !phoneRegex.test(formData.hrPhone.trim())) {
      setError('Invalid phone number format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError('');
      if (editingRecord) {
        await api.put(`/hr/${editingRecord._id}`, formData);
      } else {
        await api.post('/hr', formData);
      }
      await fetchData();
      setShowAddModal(false);
      setShowEditModal(false);
      setEditingRecord(null);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save record. Please try again.');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/hr/${id}/active`);
      await fetchData();
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>HR Records Management</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="home-content">
        <div className="toolbar">
          <div className="filter-section">
            <label htmlFor="company-filter">Filter by Company:</label>
            <input
              type="text"
              id="company-filter"
              placeholder="Type company name..."
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="filter-input"
            />
          </div>
          <button onClick={handleAddClick} className="add-button">
            + Add Record
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Company Profile Link</th>
                <th>HR Name</th>
                <th>HR Profile Link</th>
                <th>HR Email</th>
                <th>HR Phone</th>
                <th>Active Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No records found</td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{record.companyName}</td>
                    <td>
                      {record.companyProfileLink ? (
                        <a href={record.companyProfileLink} target="_blank" rel="noopener noreferrer">
                          {record.companyProfileLink}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{record.hrName}</td>
                    <td>
                      {record.hrProfileLink ? (
                        <a href={record.hrProfileLink} target="_blank" rel="noopener noreferrer">
                          {record.hrProfileLink}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{record.hrEmail}</td>
                    <td>{record.hrPhone}</td>
                    <td>
                      <span
                        className={`status-badge ${record.active ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleActive(record._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {record.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEmailClick(record)}
                          className="email-button"
                          title="Send Email"
                        >
                          ✉ Email
                        </button>
                        <button
                          onClick={() => handleEditClick(record)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company Profile Link</label>
                  <input
                    type="url"
                    name="companyProfileLink"
                    value={formData.companyProfileLink}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>HR Name *</label>
                  <input
                    type="text"
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HR Profile Link</label>
                  <input
                    type="url"
                    name="hrProfileLink"
                    value={formData.hrProfileLink}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>HR Email *</label>
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HR Phone</label>
                  <input
                    type="tel"
                    name="hrPhone"
                    value={formData.hrPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => { setShowAddModal(false); resetForm(); }} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Record</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company Profile Link</label>
                  <input
                    type="url"
                    name="companyProfileLink"
                    value={formData.companyProfileLink}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>HR Name *</label>
                  <input
                    type="text"
                    name="hrName"
                    value={formData.hrName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HR Profile Link</label>
                  <input
                    type="url"
                    name="hrProfileLink"
                    value={formData.hrProfileLink}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>HR Email *</label>
                  <input
                    type="email"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>HR Phone</label>
                  <input
                    type="tel"
                    name="hrPhone"
                    value={formData.hrPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                    Active
                  </label>
                </div>
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => { setShowEditModal(false); resetForm(); setEditingRecord(null); }} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      <EmailModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)}
        hrRecord={selectedRecordForEmail}
      />
    </div>
  );
};

export default Home;

