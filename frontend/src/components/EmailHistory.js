import React, { useState, useEffect } from 'react';
import './EmailHistory.css';

const EmailHistory = ({ isOpen, onClose }) => {
  const [sentEmails, setSentEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const emails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
      setSentEmails(emails);
    }
  }, [isOpen]);

  const deleteEmail = (id) => {
    const updated = sentEmails.filter(email => email.id !== id);
    setSentEmails(updated);
    localStorage.setItem('sentEmails', JSON.stringify(updated));
    setSelectedEmail(null);
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete all email records?')) {
      setSentEmails([]);
      localStorage.setItem('sentEmails', JSON.stringify([]));
      setSelectedEmail(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="email-history-overlay" onClick={onClose}>
      <div className="email-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="history-header">
          <h2>Email History</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="history-content">
          {sentEmails.length === 0 ? (
            <div className="no-emails">
              <p>No emails sent yet</p>
            </div>
          ) : (
            <div className="emails-list">
              {sentEmails.map((email) => (
                <div 
                  key={email.id} 
                  className="email-item"
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="email-item-header">
                    <div>
                      <strong>{email.studentName}</strong>
                      <span className="email-to">{email.hrEmail}</span>
                    </div>
                    <span className={`status-badge ${email.status}`}>
                      {email.status}
                    </span>
                  </div>
                  <div className="email-item-details">
                    <small>{new Date(email.timestamp).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {sentEmails.length > 0 && (
          <div className="history-footer">
            <button className="clear-all-btn" onClick={clearAll}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="email-detail-modal" onClick={() => setSelectedEmail(null)}>
          <div className="email-detail-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="detail-header">
              <h3>Email Details</h3>
              <button className="close-btn" onClick={() => setSelectedEmail(null)}>&times;</button>
            </div>
            <div className="detail-content">
              <div className="detail-field">
                <strong>To:</strong> {selectedEmail.hrEmail}
              </div>
              <div className="detail-field">
                <strong>HR Name:</strong> {selectedEmail.hrName}
              </div>
              <div className="detail-field">
                <strong>Company:</strong> {selectedEmail.companyName}
              </div>
              <div className="detail-field">
                <strong>Student Name:</strong> {selectedEmail.studentName}
              </div>
              <div className="detail-field">
                <strong>Student Phone:</strong> {selectedEmail.studentPhone}
              </div>
              <div className="detail-field">
                <strong>Resume:</strong> <a href={selectedEmail.resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>
              </div>
              <div className="detail-field">
                <strong>Sent:</strong> {new Date(selectedEmail.timestamp).toLocaleString()}
              </div>
              <div className="detail-field">
                <strong>Status:</strong> {selectedEmail.status}
              </div>
            </div>
            <div className="detail-footer">
              <button 
                className="delete-btn" 
                onClick={() => deleteEmail(selectedEmail.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailHistory;
