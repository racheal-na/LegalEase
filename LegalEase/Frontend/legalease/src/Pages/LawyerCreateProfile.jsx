import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useEffect } from 'react';

const LawyerCreateProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    YearsOfExperience: '',
    currentWorkingLocation: '',
    minPriceInETB: '',
    profileImage: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = async(e) => {
    if (e.target.name === 'profileImage') {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
     
      setFormData({
        ...formData,
        profileImage: base64,
      });
      
     
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
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
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/lawyerProfile/createProfile`, formData, 
        {withCredentials: true});
      
      console.log('Response received:', response);
      
      if (response.status === 200 || response.status === 201) {
        console.log('Profile created successfully, navigating to lawyer page');
        navigate('/lawyerPage');
      } else {
        console.log('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBackToDashboard = () => {
    navigate('/lawyerPage');
  };

  useEffect(()=>{
    
  })

  return (
    <div className="lawyer-profile-create-container">
      <div className="progress-header">
        <div className="logo">
          <i className="fas fa-balance-scale"></i>
          <span>Justice Partners</span>
        </div>
        <div className="header-actions">
          <button 
            className="back-to-dashboard-btn"
            onClick={handleBackToDashboard}
            disabled={isLoading}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Personal Info</p>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Professional Details</p>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Photo & Finish</p>
          </div>
        </div>
      </div>

      <div className="profile-creation-content">
        <div className="creation-intro">
          <h1>Complete Your Professional Profile</h1>
          <p>Showcase your expertise to potential clients with a complete profile. This helps build trust and credibility.</p>
          <div className="profile-completion">
            <div className="completion-text">
              <span>Profile Completion</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="completion-bar">
              <div 
                className="completion-progress" 
                style={{width: `${(currentStep / 3) * 100}%`}}
              ></div>
            </div>
          </div>
        </div>

        <div className="creation-form-card">
          <form onSubmit={handleSubmit} className="lawyer-profile-form" encType="multipart/form-data">
            {currentStep === 1 && (
              <div className="form-step">
                <h2>Personal Information</h2>
                <p>Let's start with your basic information</p>
                
                <div className="input-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full legal name"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="+251 XXX XXX XXX"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="currentWorkingLocation">Current Working Location *</label>
                  <input
                    type="text"
                    id="currentWorkingLocation"
                    name="currentWorkingLocation"
                    value={formData.currentWorkingLocation}
                    onChange={handleChange}
                    required
                    placeholder="City or region where you practice"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-navigation">
                  <button type="button" className="next-btn" onClick={nextStep} disabled={isLoading}>
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="form-step">
                <h2>Professional Details</h2>
                <p>Tell us about your legal practice</p>
                
                <div className="input-group">
                  <label htmlFor="licenseNumber">License Number *</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    required
                    placeholder="Your bar association license number"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="YearsOfExperience">Years of Experience *</label>
                  <input
                    type="number"
                    id="YearsOfExperience"
                    name="YearsOfExperience"
                    value={formData.YearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Number of years practicing law"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="input-group">
                  <label htmlFor="minPriceInETB">Minimum Consultation Fee (ETB) *</label>
                  <input
                    type="number"
                    id="minPriceInETB"
                    name="minPriceInETB"
                    value={formData.minPriceInETB}
                    onChange={handleChange}
                    min="0"
                    required
                    placeholder="Your minimum fee for consultation"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-navigation">
                  <button type="button" className="back-btn" onClick={prevStep} disabled={isLoading}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  <button type="button" className="next-btn" onClick={nextStep} disabled={isLoading}>
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="form-step">
                <h2>Profile Photo</h2>
                <p>Add a professional photo to build trust with clients</p>
                
                <div className="image-upload-section">
                  <div className="upload-container">
                    <div className="upload-preview">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Profile preview" />
                      ) : (
                        <div className="upload-placeholder">
                          <i className="fas fa-camera"></i>
                          <p>Upload your professional photo</p>
                        </div>
                      )}
                    </div>
                    <div className="upload-controls">
                      <label htmlFor="profileImage" className={`upload-btn ${isLoading ? 'disabled' : ''}`}>
                        Choose Image
                      </label>
                      <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleChange}
                        accept="image/*"
                        required
                        style={{display: 'none'}}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="upload-tips">
                    <h4>Photo Guidelines:</h4>
                    <ul>
                      <li>Use a clear, professional headshot</li>
                      <li>Face should be clearly visible</li>
                      <li>Neutral background recommended</li>
                      <li>Professional attire preferred</li>
                    </ul>
                  </div>
                </div>
                
                <div className="form-navigation">
                  <button type="button" className="back-btn" onClick={prevStep} disabled={isLoading}>
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  <button 
                    type="submit" 
                    className={`submit-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Creating Profile...
                      </>
                    ) : (
                      <>
                        Complete Profile <i className="fas fa-check"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      
      <style jsx>{`
        .lawyer-profile-create-container {
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .progress-header {
          max-width: 900px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 15px;
        }
        
        .logo i {
          margin-right: 10px;
          font-size: 28px;
          color: #3498db;
        }
        
        .header-actions {
          margin-bottom: 15px;
        }
        
        .back-to-dashboard-btn {
          background: #6c757d;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .back-to-dashboard-btn:hover:not(:disabled) {
          background: #5a6268;
          transform: translateY(-1px);
        }
        
        .back-to-dashboard-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .progress-bar {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }
        
        .progress-step:not(:last-child):after {
          content: '';
          position: absolute;
          top: 20px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: #e0e0e0;
          z-index: 1;
        }
        
        .progress-step.active:not(:last-child):after {
          background: #3498db;
        }
        
        .progress-step span {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          position: relative;
          z-index: 2;
          color: white;
          font-weight: bold;
        }
        
        .progress-step.active span {
          background: #3498db;
        }
        
        .progress-step p {
          margin: 0;
          font-size: 14px;
          color: #7f8c8d;
          text-align: center;
        }
        
        .progress-step.active p {
          color: #2c3e50;
          font-weight: 500;
        }
        
        .profile-creation-content {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
        }
        
        .creation-intro {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          height: fit-content;
        }
        
        .creation-intro h1 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 28px;
        }
        
        .creation-intro p {
          color: #7f8c8d;
          line-height: 1.6;
          margin-bottom: 25px;
        }
        
        .profile-completion {
          background: #f8fafc;
          border-radius: 10px;
          padding: 20px;
        }
        
        .completion-text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 500;
          color: #2c3e50;
        }
        
        .completion-bar {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .completion-progress {
          height: 100%;
          background: #3498db;
          border-radius: 4px;
          transition: width 0.3s ease;
        }
        
        .creation-form-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .form-step h2 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 24px;
        }
        
        .form-step p {
          color: #7f8c8d;
          margin-bottom: 25px;
        }
        
        .input-group {
          margin-bottom: 20px;
        }
        
        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .input-group input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }
        
        .input-group input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .image-upload-section {
          margin-bottom: 25px;
        }
        
        .upload-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .upload-preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e0e0e0;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }
        
        .upload-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .upload-placeholder {
          text-align: center;
          color: #7f8c8d;
        }
        
        .upload-placeholder i {
          font-size: 40px;
          margin-bottom: 10px;
          display: block;
          color: #bdc3c7;
        }
        
        .upload-btn {
          background: #3498db;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          display: inline-block;
        }
        
        .upload-btn:hover:not(.disabled) {
          background: #2980b9;
        }
        
        .upload-btn.disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .upload-tips {
          background: #f8fafc;
          border-radius: 8px;
          padding: 15px;
        }
        
        .upload-tips h4 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        .upload-tips ul {
          margin: 0;
          padding-left: 20px;
          color: #7f8c8d;
        }
        
        .upload-tips li {
          margin-bottom: 5px;
        }
        
        .form-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        
        .back-btn, .next-btn, .submit-btn {
          padding: 12px 25px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .back-btn {
          background: #f8fafc;
          color: #7f8c8d;
          border: 1px solid #ddd;
        }
        
        .back-btn:hover:not(:disabled) {
          background: #e0e0e0;
        }
        
        .next-btn, .submit-btn {
          background: #3498db;
          color: white;
          border: none;
        }
        
        .next-btn:hover:not(:disabled), .submit-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-1px);
        }
        
        .back-btn:disabled, .next-btn:disabled, .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .submit-btn.loading {
          background: #6c757d;
        }
        
        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .profile-creation-content {
            grid-template-columns: 1fr;
          }
          
          .progress-header {
            flex-direction: column;
            text-align: center;
          }
          
          .progress-bar {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          
          .progress-step:not(:last-child):after {
            display: none;
          }
          
          .header-actions {
            order: -1;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default LawyerCreateProfile;

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