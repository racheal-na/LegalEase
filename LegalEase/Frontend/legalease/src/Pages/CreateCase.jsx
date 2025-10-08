import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';

const CreateCase = () => {
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseDiscription: '',
    caseType: '',
    appointmentTime: '',
    caseFile: null
  });
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const lawyerId = location.state?.lawyerId;

  const verifyAuth = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/verifyUser`, {
        withCredentials: true
      });
      
      if (response.data.status === true) {
        console.log("User Is Authenticated!!!!")
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setError('Authentication failed. Please sign in again.');
      setIsAuthenticated(false);
      return false;
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      const authValid = await verifyAuth();
      if (!authValid) return;
      
      if (!lawyerId) {
        setError('No lawyer selected. Please go back and select a lawyer first.');
        return;
      }

      await fetchAvailableTimes();
    };

    initializePage();
  }, [lawyerId]);

  const fetchAvailableTimes = async () => {
    setIsLoadingTimes(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/availableDate/getAvailableDateForUser`, {
         params: { lawyerId },
        withCredentials: true 
      });
      
      setAvailableTimes(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError('Failed to fetch available times. Please try again.');
      }
      console.error('Error fetching available times:', error);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const handleChange = async (e) => {
    if (e.target.name === 'caseFile') {
      const file = e.target.files[0];
      if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('File size should be less than 5MB');
          return;
        }
        
        // Check file type
        const allowedTypes = [
          'application/pdf', 
          'image/jpeg', 
          'image/png', 
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          setError('Please upload a PDF, DOC, DOCX, JPEG, or PNG file');
          return;
        }
        
        setFileName(file.name);
        const base64 = await convertToBase64(file);
        
        setFormData({
          ...formData,
          caseFile: base64,
        });
        
        // Create preview for images
        if (file.type.includes('image')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreview(null);
        }
        
        setError(''); // Clear any previous errors
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You are not authenticated. Please sign in again.');
      return;
    }
    
    if (!lawyerId) {
      setError('No lawyer selected. Please go back and select a lawyer first.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cases/createCase`, 
        {
          ...formData,
          lawyerId: lawyerId
        },
        {
          withCredentials: true 
        }
      );
      
      if (response.status === 201) {
        setSuccess('Case created successfully!');
        setTimeout(() => {
          navigate('/displayUserCases'); 
        }, 1500);
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Your session has expired. Please sign in again.');
      } else {
        setError(error.response?.data?.message || 'Case creation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const handleSignOut = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      navigate('/userSignin');
    }
  };

  const removeFile = () => {
    setFormData({
      ...formData,
      caseFile: null
    });
    setFilePreview(null);
    setFileName('');
  };

  if (!isAuthenticated && error.includes('Authentication')) {
    return (
      <div className="auth-error-container">
        <div className="auth-error-card">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Authentication Required</h2>
          <p>{error}</p>
          <button className="sign-in-btn" onClick={() => navigate('/signin')}>
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-case-modern-container">
      <div className="create-case-modern-card">
        <div className="case-header">
                    <div className="header-buttons">
            <button className="back-dashboard-btn" onClick={() => navigate('/userPage')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>

          <h1>Create New Case</h1>
          <p>Follow the steps to create a new legal case file</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div className={`progress-step ${activeStep >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <div className="step-label">Basic Info</div>
            </div>
            <div className={`progress-step ${activeStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <div className="step-label">Details</div>
            </div>
            <div className={`progress-step ${activeStep >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <div className="step-label">Schedule</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message-modern">
            <i className="fas fa-exclamation-circle"></i>
            {error}
            {(error.includes('authenticated') || error.includes('session')) && (
              <button className="sign-in-again-btn" onClick={() => navigate('/signin')}>
                Sign In Again
              </button>
            )}
          </div>
        )}

        {success && (
          <div className="success-message-modern">
            <i className="fas fa-check-circle"></i>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-case-modern-form">
          {activeStep === 1 && (
            <div className="form-step">
              <h2>Case Basic Information</h2>
              <div className="input-group-modern">
                <label htmlFor="caseTitle">Case Title *</label>
                <input
                  type="text"
                  id="caseTitle"
                  name="caseTitle"
                  value={formData.caseTitle}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Enter a descriptive case title"
                />
              </div>
              
              <div className="input-group-modern">
                <label htmlFor="caseType">Case Type *</label>
                <select
                  id="caseType"
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select case type</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Civil">Civil</option>
                  <option value="Family">Family</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-navigation">
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}
          
          {activeStep === 2 && (
            <div className="form-step">
              <h2>Case Details</h2>
              <div className="input-group-modern">
                <label htmlFor="caseDiscription">Case Description *</label>
                <textarea
                  id="caseDiscription"
                  name="caseDiscription"
                  value={formData.caseDiscription}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Provide a detailed description of the case, including relevant facts, events, and objectives"
                  rows="5"
                />
              </div>
              
              <div className="input-group-modern">
                <label htmlFor="caseFile">Upload Case File (Optional)</label>
                <div className="file-upload-container">
                  {!formData.caseFile ? (
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="caseFile"
                        name="caseFile"
                        onChange={handleChange}
                        disabled={isLoading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="file-input"
                      />
                      <label htmlFor="caseFile" className="file-upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Choose file or drag & drop here</span>
                        <p>PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                      </label>
                    </div>
                  ) : (
                    <div className="file-preview-container">
                      {filePreview ? (
                        <div className="image-preview">
                          <img src={filePreview} alt="File preview" />
                        </div>
                      ) : (
                        <div className="file-info">
                          <i className="fas fa-file"></i>
                          <span>{fileName}</span>
                        </div>
                      )}
                      <button 
                        type="button" 
                        className="remove-file-btn"
                        onClick={removeFile}
                        disabled={isLoading}
                      >
                        <i className="fas fa-times"></i> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-navigation">
                <button type="button" className="prev-btn" onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}
          
          {activeStep === 3 && (
            <div className="form-step">
              <h2>Select Appointment Time</h2>
              
              {isLoadingTimes ? (
                <div className="loading-times">
                  <i className="fas fa-spinner fa-spin"></i>
                  Loading available times...
                </div>
              ) : availableTimes.length === 0 ? (
                <div className="no-available-times">
                  <i className="fas fa-calendar-times"></i>
                  <p>No available times found for this lawyer.</p>
                  <button 
                    type="button" 
                    className="prev-btn"
                    onClick={prevStep}
                  >
                    <i className="fas fa-arrow-left"></i> Back to Details
                  </button>
                </div>
              ) : (
                <>
                  <div className="input-group-modern">
                    <label htmlFor="appointmentTime">Select Available Time *</label>
                    <select
                      id="appointmentTime"
                      name="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a time slot</option>
                      {availableTimes.map((slot) => (
                        <option key={slot._id} value={slot._id}>
                          {formatDate(slot.availableDate)} - {formatTime(slot.startTime)} to {formatTime(slot.endTime)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-navigation">
                    <button type="button" className="prev-btn" onClick={prevStep}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button 
                      type="submit" 
                      className="create-case-btn-modern"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Creating Case...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus-circle"></i>
                          Create Case
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        .auth-error-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
        }
        
        .auth-error-card {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }
        
        .auth-error-card i {
          font-size: 3rem;
          color: #c53030;
          margin-bottom: 1rem;
        }
        
        .auth-error-card h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .auth-error-card p {
          color: #7b8a9b;
          margin-bottom: 1.5rem;
        }
        
        .sign-in-btn {
          background: #4a6580;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .sign-in-btn:hover {
          background: #3a556c;
        }
        
        .create-case-modern-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .create-case-modern-card {
          max-width: 700px;
          width: 100%;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          padding: 2.5rem;
          position: relative;
        }
        
        .case-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }
        
        .header-buttons {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .back-dashboard-btn {
          background: #f8f9fa;
          color: #4a6580;
          border: 2px solid #e9ecef;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .back-dashboard-btn:hover {
          background: #e9ecef;
        }
        
        .sign-out-btn {
          background: #f8f9fa;
          color: #4a6580;
          border: 2px solid #e9ecef;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .sign-out-btn:hover {
          background: #e9ecef;
        }
        
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .logo i {
          margin-right: 0.5rem;
          font-size: 1.8rem;
          color: #4a6580;
        }
        
        .case-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }
        
        .case-header p {
          color: #7b8a9b;
          font-size: 1.1rem;
        }
        
        .progress-container {
          margin-bottom: 2.5rem;
        }
        
        .progress-bar {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .progress-bar::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 4px;
          background: #e9ecef;
          z-index: 1;
        }
        
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          width: ${(activeStep - 1) * 50}%;
          height: 4px;
          background: #4a6580;
          transition: width 0.3s ease;
          z-index: 2;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 3;
        }
        
        .progress-step span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #7b8a9b;
          font-weight: bold;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .progress-step.active span {
          background: #4a6580;
          color: white;
          box-shadow: 0 0 0 4px rgba(74, 101, 128, 0.2);
        }
        
        .step-label {
          font-size: 0.85rem;
          color: #7b8a9b;
          font-weight: 500;
        }
        
        .progress-step.active .step-label {
          color: #4a6580;
        }
        
        .error-message-modern {
          background-color: #fee;
          color: #c53030;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 4px solid #c53030;
          flex-direction: column;
        }
        
        .sign-in-again-btn {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: #c53030;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .success-message-modern {
          background-color: #f0fff4;
          color: #2f855a;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 4px solid #2f855a;
        }
        
        .create-case-modern-form {
          display: flex;
          flex-direction: column;
        }
        
        .form-step {
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .form-step h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          text-align: center;
        }
        
        .input-group-modern {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }
        
        .input-group-modern label {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .input-group-modern input,
        .input-group-modern textarea,
        .input-group-modern select {
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        
        .input-group-modern input:focus,
        .input-group-modern textarea:focus,
        .input-group-modern select:focus {
          outline: none;
          border-color: #4a6580;
          box-shadow: 0 0 0 3px rgba(74, 101, 128, 0.1);
        }
        
        .input-group-modern input:disabled,
        .input-group-modern textarea:disabled,
        .input-group-modern select:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        
        /* File Upload Styles */
        .file-upload-container {
          margin-top: 0.5rem;
        }
        
        .file-upload-area {
          position: relative;
          border: 2px dashed #e9ecef;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .file-upload-area:hover {
          border-color: #4a6580;
          background-color: #f8f9fa;
        }
        
        .file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }
        
        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .file-upload-label i {
          font-size: 2rem;
          color: #4a6580;
        }
        
        .file-upload-label span {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .file-upload-label p {
          color: #7b8a9b;
          font-size: 0.85rem;
          margin: 0;
        }
        
        .file-preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          background-color: #f8f9fa;
        }
        
        .image-preview {
          max-width: 200px;
          max-height: 200px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-radius: 4px;
          border: 1px solid #e9ecef;
        }
        
        .file-info i {
          color: #4a6580;
          font-size: 1.2rem;
        }
        
        .file-info span {
          font-weight: 500;
          color: #2c3e50;
        }
        
        .remove-file-btn {
          background: #fee;
          color: #c53030;
          border: 1px solid #fcc;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .remove-file-btn:hover:not(:disabled) {
          background: #fdd;
        }
        
        .remove-file-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .loading-times,
        .no-available-times {
          text-align: center;
          padding: 2rem;
          color: #7b8a9b;
        }
        
        .loading-times i,
        .no-available-times i {
          font-size: 2rem;
          margin-bottom: 1rem;
          display: block;
        }
        
        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        .prev-btn,
        .next-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .prev-btn {
          background: #f8f9fa;
          color: #4a6580;
          border: 2px solid #e9ecef;
        }
        
        .prev-btn:hover {
          background: #e9ecef;
        }
        
        .next-btn {
          background: #4a6580;
          color: white;
          border: none;
        }
        
        .next-btn:hover {
          background: #3a556c;
          box-shadow: 0 4px 12px rgba(74, 101, 128, 0.2);
        }
        
        .create-case-btn-modern {
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .create-case-btn-modern:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        
        .create-case-btn-modern:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        @media (max-width: 768px) {
          .create-case-modern-card {
            padding: 1.5rem;
          }
          
          .header-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .progress-step .step-label {
            display: none;
          }
          
          .form-navigation {
            flex-direction: column;
            gap: 1rem;
          }
          
          .prev-btn,
          .next-btn,
          .create-case-btn-modern {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default CreateCase;

function convertToBase64(file){
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result)
    };
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}