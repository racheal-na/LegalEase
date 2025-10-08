import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';

const UpdateLawyerProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    YearsOfExperience: '',
    currentWorkingLocation: '',
    minPriceInETB: '',
    profileImage: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyLawyer`, {
          withCredentials: true
        });

        if (res.data.status) {
          try {
            const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lawyerProfile/getProfileById`, {
              withCredentials: true
            });

            if (profileRes.status === 200) {
              setProfileData(profileRes.data);
              setFormData({
                fullName: profileRes.data.fullName || '',
                phoneNumber: profileRes.data.phoneNumber || '',
                licenseNumber: profileRes.data.licenseNumber || '',
                YearsOfExperience: profileRes.data.YearsOfExperience || '',
                currentWorkingLocation: profileRes.data.currentWorkingLocation || '',
                minPriceInETB: profileRes.data.minPriceInETB || '',
                profileImage: profileRes.data.profileImage || ''
              });
            } else {
              setMessage({ text: 'No profile found. Please create one first.', type: 'error' });
            }
          } catch (error) {
            console.log('Error fetching profile:', error);
            setMessage({ text: 'Error loading profile data', type: 'error' });
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profileImage: imageUrl
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/lawyerProfile/updateProfile`,
        formData,
        { withCredentials: true }
      );
      
      if (res.status === 200) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => {
          navigate('/lawyerPage');
        }, 1500);
      }
    } catch (error) {
      console.log('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <PropagateLoader size={15} color={"#2c3e50"} />
          </div>
          <h2>Loading Your Profile</h2>
          <p>Please wait while we retrieve your profile information...</p>
        </div>
        
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .loading-content {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 90%;
          }
          
          .loading-spinner {
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
          }
          
          .loading-content h2 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.8rem;
          }
          
          .loading-content p {
            color: #7b8a9b;
            font-size: 1.1rem;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="update-profile-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-item" onClick={() => navigate('/lawyerDashboard')}>Dashboard</button>
            <button className="nav-item">Cases</button>
            <button className="nav-item">Clients</button>
            <button className="nav-item">Availability</button>
            <button className="nav-item">Calendar</button>
          </nav>
          <button className="logout-btn" onClick={() => navigate('/lawyerDashboard')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="update-profile-main">
        <div className="page-header">
          <h1>Update Your Profile</h1>
          <p>Keep your information current to attract more clients</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-sections">
            {/* Profile Image Section */}
            <div className="form-section">
              <h2>Profile Image</h2>
              
              <div className="profile-image-upload">
                <div className="image-preview">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile preview" />
                  ) : (
                    <div className="empty-image">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <label htmlFor="image-upload" className="upload-btn">
                  <i className="fas fa-camera"></i> {formData.profileImage ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {imageFile && (
                  <p className="file-name">{imageFile.name}</p>
                )}
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="licenseNumber">License Number *</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="YearsOfExperience">Years of Experience *</label>
                  <input
                    type="number"
                    id="YearsOfExperience"
                    name="YearsOfExperience"
                    value={formData.YearsOfExperience}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currentWorkingLocation">Current Working Location *</label>
                  <input
                    type="text"
                    id="currentWorkingLocation"
                    name="currentWorkingLocation"
                    value={formData.currentWorkingLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="minPriceInETB">Consultation Fee (ETB) *</label>
                  <input
                    type="number"
                    id="minPriceInETB"
                    name="minPriceInETB"
                    value={formData.minPriceInETB}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/lawyerDashboard')} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? <PropagateLoader size={8} color={"#fff"} /> : 'Update Profile'}
            </button>
          </div>
        </form>
      </main>

      <style jsx>{`
        .update-profile-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-header {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

        .dashboard-nav {
          display: flex;
          gap: 1.5rem;
        }

        .nav-item {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          padding: 0.5rem 0;
          font-size: 1rem;
          position: relative;
          transition: color 0.3s;
        }

        .nav-item:hover {
          color: white;
        }

        .logout-btn {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s;
        }

        .logout-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .update-profile-main {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .page-header h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }

        .page-header p {
          color: #7b8a9b;
          font-size: 1.1rem;
        }

        .message {
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .profile-form {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e9ecef;
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 1rem;
        }

        .form-section h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-section h2:before {
          content: '';
          display: block;
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          border-radius: 2px;
        }

        .profile-image-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .image-preview {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1rem;
          border: 4px solid #4a6580;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .empty-image {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #e9ecef;
          color: #6c757d;
        }

        .empty-image i {
          font-size: 3rem;
        }

        .upload-btn {
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.3s;
          margin-bottom: 0.5rem;
        }

        .upload-btn:hover {
          opacity: 0.9;
        }

        .file-name {
          font-size: 0.9rem;
          color: #6c757d;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a6580;
        }

        .form-group input {
          padding: 0.8rem;
          border: 1px solid #ced4da;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4a6580;
          box-shadow: 0 0 0 3px rgba(74, 101, 128, 0.1);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .cancel-btn {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        .cancel-btn:hover {
          background: #5a6268;
        }

        .submit-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          min-width: 140px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: opacity 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .loading-container p {
          margin-top: 1rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .dashboard-nav {
            order: 3;
            overflow-x: auto;
            width: 100%;
            padding-bottom: 0.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-btn,
          .submit-btn {
            width: 100%;
          }
        }
      `}</style>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />
    </div>
  );
};

export default UpdateLawyerProfile;