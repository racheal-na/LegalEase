import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const CreateAvailableDate = () => {
  const [formData, setFormData] = useState({
    availableDate: '',
    startTime: '09:00',
    endTime: '17:00'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false); 
  const [verificationLoading, setVerificationLoading] = useState(true); 
  
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyLawyer`, {
          withCredentials: true
        });
        
        if (res.data.status) {
          setIsVerified(true);
        } else {
          navigate('/lawyerSignin');
        }
      } catch (err) {
        console.error('Verification error:', err);
        navigate('/lawyerSignin');
      } finally {
        setVerificationLoading(false);
      }
    };
    
    verify();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/availableDate/setAvailableDate`, formData, {
        withCredentials: true
      });
      
      if (response.status === 201) {
        setSuccess('Time slot added successfully!');
        setFormData({
          availableDate: formData.availableDate,
          startTime: formData.startTime,
          endTime: formData.endTime
        });
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
      navigate('/displayAvailability');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create availability. Please try again.');
      console.error('Create availability error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        options.push(
          <option key={timeString} value={timeString}>
            {displayTime}
          </option>
        );
      }
    }
    return options;
  };


  if (verificationLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Verifying your session...</p>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
          .loading-spinner {
            text-align: center;
            color: #4a6580;
          }
          .loading-spinner i {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }


  if (!isVerified) {
    return null; 
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-calendar-plus"></i>
            <span>Schedule Availability</span>
          </div>
          <button 
            className="back-button"
            onClick={() => navigate('/lawyerPage')}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
      </div>

      <div className="scheduler-content">
        <div className="scheduler-sidebar">
          <div className="sidebar-card">
            <h3><i className="fas fa-info-circle"></i> Scheduling Tips</h3>
            <ul>
              <li>Set consistent time blocks for better client experience</li>
              <li>Allow 15-30 minutes between appointments for preparation</li>
              <li>Consider your most productive hours when setting availability</li>
              <li>Clients can book up to 24 hours in advance</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3><i className="fas fa-clock"></i> Quick Select</h3>
            <div className="quick-time-buttons">
              <button 
                className="time-preset"
                onClick={() => setFormData({
                  ...formData,
                  startTime: '09:00',
                  endTime: '12:00'
                })}
              >
                9 AM - 12 PM
              </button>
              <button 
                className="time-preset"
                onClick={() => setFormData({
                  ...formData,
                  startTime: '13:00',
                  endTime: '17:00'
                })}
              >
                1 PM - 5 PM
              </button>
              <button 
                className="time-preset"
                onClick={() => setFormData({
                  ...formData,
                  startTime: '09:00',
                  endTime: '17:00'
                })}
              >
                Full Day (9-5)
              </button>
            </div>
          </div>
        </div>

        <div className="scheduler-main">
          <div className="scheduler-card">
            <div className="card-header">
              <h2><i className="fas fa-calendar-alt"></i> Add Available Time Slot</h2>
              <p>Select when you'll be available for client consultations</p>
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="scheduler-form">
              <div className="form-section">
                <h3><i className="fas fa-calendar-day"></i> Select Date</h3>
                <div className="date-input-container">
                  <input
                    type="date"
                    id="availableDate"
                    name="availableDate"
                    value={formData.availableDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="date-input"
                  />
                  <i className="fas fa-calendar input-icon"></i>
                </div>
              </div>

              <div className="form-section">
                <h3><i className="fas fa-clock"></i> Set Time Range</h3>
                <div className="time-range-container">
                  <div className="time-input-group">
                    <label htmlFor="startTime">From</label>
                    <div className="select-container">
                      <select
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="time-select"
                      >
                        {generateTimeOptions()}
                      </select>
                      <i className="fas fa-chevron-down select-icon"></i>
                    </div>
                  </div>

                  <div className="time-separator">
                    <i className="fas fa-arrows-alt-h"></i>
                  </div>

                  <div className="time-input-group">
                    <label htmlFor="endTime">To</label>
                    <div className="select-container">
                      <select
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="time-select"
                      >
                        {generateTimeOptions()}
                      </select>
                      <i className="fas fa-chevron-down select-icon"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="duration-display">
                <h4>Duration: 
                  <span className="duration-value">
                    {(() => {
                      const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
                      const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
                      
                      const startTotal = startHours * 60 + startMinutes;
                      const endTotal = endHours * 60 + endMinutes;
                      const durationMinutes = endTotal - startTotal;
                      
                      if (durationMinutes <= 0) return " Invalid";
                      
                      const hours = Math.floor(durationMinutes / 60);
                      const minutes = durationMinutes % 60;
                      
                      return ` ${hours}h ${minutes}m`;
                    })()}
                  </span>
                </h4>
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Adding Time Slot...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle"></i> Add Availability
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="preview-card">
            <h3><i className="fas fa-eye"></i> Preview</h3>
            {formData.availableDate ? (
              <div className="preview-content">
                <div className="preview-date">
                  {new Date(formData.availableDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="preview-time">
                  {(() => {
                    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
                    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
                    
                    const startPeriod = startHours >= 12 ? 'PM' : 'AM';
                    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
                    
                    const displayStartHours = startHours % 12 || 12;
                    const displayEndHours = endHours % 12 || 12;
                    
                    return `${displayStartHours}:${startMinutes.toString().padStart(2, '0')} ${startPeriod} - ${displayEndHours}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
                  })()}
                </div>
              </div>
            ) : (
              <p className="preview-placeholder">Select a date to see preview</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scheduler-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .scheduler-header {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .logo i {
          margin-right: 0.5rem;
          font-size: 1.8rem;
        }
        
        .back-button {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s;
        }
        
        .back-button:hover {
          background: rgba(255,255,255,0.2);
        }
        
        .scheduler-content {
          display: flex;
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 2rem;
          gap: 2rem;
        }
        
        .scheduler-sidebar {
          flex: 0 0 300px;
        }
        
        .scheduler-main {
          flex: 1;
        }
        
        .sidebar-card, .scheduler-card, .preview-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          margin-bottom: 1.5rem;
        }
        
        .sidebar-card h3, .card-header h2 {
          color: #2c3e50;
          margin-top: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .sidebar-card ul {
          padding-left: 1.5rem;
          color: #4a5568;
        }
        
        .sidebar-card li {
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }
        
        .quick-time-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .time-preset {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        
        .time-preset:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }
        
        .card-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .card-header p {
          color: #718096;
          margin: 0.5rem 0 0 0;
        }
        
        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .success-message {
          background: #c6f6d5;
          color: #2f855a;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .form-section {
          margin-bottom: 2rem;
        }
        
        .form-section h3 {
          color: #4a6580;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .date-input-container {
          position: relative;
          max-width: 300px;
        }
        
        .date-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 1rem;
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
        }
        
        .time-range-container {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          max-width: 500px;
        }
        
        .time-input-group {
          flex: 1;
        }
        
        .time-input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
        }
        
        .select-container {
          position: relative;
        }
        
        .time-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 1rem;
          appearance: none;
          background: white;
        }
        
        .select-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          pointer-events: none;
        }
        
        .time-separator {
          padding-bottom: 1.75rem;
          color: #a0aec0;
        }
        
        .duration-display {
          margin: 1.5rem 0;
          padding: 1rem;
          background: #f0f4f8;
          border-radius: 6px;
        }
        
        .duration-display h4 {
          margin: 0;
          color: #2d3748;
        }
        
        .duration-value {
          color: #2c3e50;
          font-weight: bold;
        }
        
        .submit-button {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.3s;
        }
        
        .submit-button:hover:not(:disabled) {
          opacity: 0.9;
        }
        
        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .preview-content {
          text-align: center;
        }
        
        .preview-date {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .preview-time {
          font-size: 1.1rem;
          color: #4a6580;
        }
        
        .preview-placeholder {
          color: #a0aec0;
          text-align: center;
          font-style: italic;
        }
        
        @media (max-width: 900px) {
          .scheduler-content {
            flex-direction: column;
          }
          
          .scheduler-sidebar {
            flex: 0;
          }
          
          .time-range-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .time-separator {
            display: none;
          }
        }
      `}</style>
      
      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default CreateAvailableDate;