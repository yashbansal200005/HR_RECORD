import React, { useState, useEffect } from 'react';
import './EmailModal.css';

const EmailModal = ({ isOpen, onClose, hrRecord }) => {
  const [studentData, setStudentData] = useState({
    name: '',
    mobilNo: '',
    resumeLink: ''
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load saved data from localStorage if exists
    const savedData = localStorage.getItem('studentApplicationData');
    if (savedData) {
      setStudentData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateEmailBody = () => {
    const hrName = hrRecord?.hrName || 'Hiring Team';
    return `Hi ${hrName},

I'm ${studentData.name}, a B.Tech student at IIIT Nagpur (Class of 2026), currently seeking full-time opportunities as an SDE. I wanted to check if there are any openings at your organization that align with my profile.

Please find my resume below for your reference:
Resume: ${studentData.resumeLink}

Thank you for your time and consideration. I look forward to hearing from you.

Best regards,
${studentData.name}
${studentData.mobilNo}`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('Failed to copy. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSendEmail = () => {
    if (!studentData.name.trim() || !studentData.mobilNo.trim() || !studentData.resumeLink.trim()) {
      alert('Please fill in all fields (Name, Mobile Number, and Resume Link)');
      return;
    }

    // Save data to localStorage for future use
    localStorage.setItem('studentApplicationData', JSON.stringify(studentData));

    // Create mailto link
    const emailBody = generateEmailBody();
    const subject = encodeURIComponent('Application for SDE Position');
    const body = encodeURIComponent(emailBody);
    const to = encodeURIComponent(hrRecord?.hrEmail || '');
    
    const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
    
    // Try to open default email client
    // On web browsers without email clients, this might not work
    // Create a temporary anchor element to trigger mailto
    const link = document.createElement('a');
    link.href = mailtoLink;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyEmail = () => {
    const emailBody = generateEmailBody();
    copyToClipboard(emailBody);
  };

  if (!isOpen) return null;

  const emailBody = generateEmailBody();

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="email-modal-header">
          <h2>Send Email to {hrRecord?.hrName || 'HR'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="email-modal-body">
          <div className="form-section">
            <h3>Your Information</h3>
            <p className="form-subtitle">Fill in your details to customize the email</p>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={studentData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobilNo">Mobile Number *</label>
              <input
                type="tel"
                id="mobilNo"
                name="mobilNo"
                value={studentData.mobilNo}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="resumeLink">Resume Link *</label>
              <input
                type="url"
                id="resumeLink"
                name="resumeLink"
                value={studentData.resumeLink}
                onChange={handleInputChange}
                placeholder="https://example.com/resume.pdf"
                className="input-field"
              />
            </div>
          </div>

          <div className="email-preview-section">
            <h3>Email Preview</h3>
            <p className="form-subtitle" style={{ marginTop: '0.5rem', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
              If email app doesn't open, use "Copy Email" button to copy and paste into Gmail/Outlook web
            </p>
            <div className="email-preview">
              <div className="preview-header">
                <div className="preview-to">
                  <strong>To:</strong> {hrRecord?.hrEmail}
                </div>
                <div className="preview-subject">
                  <strong>Subject:</strong> Application for SDE Position
                </div>
              </div>
              <div className="preview-body">
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                  {studentData.name && studentData.mobilNo && studentData.resumeLink 
                    ? emailBody 
                    : 'Fill in your details to see the email preview...'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="email-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="copy-btn" 
            onClick={handleCopyEmail}
            title="Copy email content to clipboard"
          >
            {copied ? '✓ Copied!' : 'Copy Email'}
          </button>
          <button 
            className="send-btn" 
            onClick={handleSendEmail}
          >
            Open Email App
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
