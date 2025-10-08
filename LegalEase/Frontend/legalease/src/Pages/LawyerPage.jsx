import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const [profileIsCreated, setProfileIsCreated] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    cases: 0,
    clients: 0
  });

  const handleLogout = () => {
    try {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`).then(res => {
        if (res.status === 200) {
          navigate('/');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProfile = () => {
    navigate('/lawyerCreateProfile');
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyLawyer`, {
          withCredentials: true
        });

        if (res.data.status) {
          try {
            setIsLoading(true);

            const [profileRes, statsRes] = await Promise.all([
              axios
                .get(`${import.meta.env.VITE_BACKEND_URL}/lawyerProfile/getProfileById`, {
                  withCredentials: true
                })
                .catch(err => err.response), 
              axios.get(`${import.meta.env.VITE_BACKEND_URL}/cases/getLawyerStats`, {
                withCredentials: true
              })
            ]);

            if (statsRes?.data?.status) {
              setStats(statsRes.data.stats);
            }
            else if(statsRes?.data?.status === 404){
              setStats(
                {cases: 0 , clients: 0}
              );
            }

      
            if (profileRes && profileRes.status === 200) {
            
              if (profileRes.data.status && profileRes.data.lawyerProfile && profileRes.data.lawyerProfile.length === 0) {
               
                setProfileIsCreated(false);
                setProfileData(null);
                console.log('No profile found - empty array');
              } else {
        
                setProfileData(profileRes.data);
                setProfileIsCreated(true);
                console.log('Profile fetched successfully');
              }
            } else {
              
              setProfileIsCreated(false);
              setProfileData(null);
              console.log('No profile found - other case');
            }
          } catch (error) {
            console.log('Error fetching data:', error);
            setProfileIsCreated(false);
            setProfileData(null);
          } finally {
            setIsLoading(false);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="lawyer-dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-item active">Dashboard</button>
            <Link to={'/displayLawyerCases'}>
              <button className="nav-item">Cases</button>
            </Link>
            <Link to={'/displayAvailability'}>
              {' '}
              <button className="nav-item">Availability</button>
            </Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-content">
              <div className="loading-animation">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-center"></div>
                </div>
                <div className="loading-text">
                  <h2>Setting Up Your Dashboard</h2>
                  <p>Loading your practice data and statistics...</p>
                </div>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Loading dashboard</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="welcome-section">
              <h1>Welcome to Your Dashboard</h1>
              <p>Manage your practice, clients, and cases all in one place</p>
            </div>

            <div className="dashboard-content">
              <div className="left-column">
                {profileIsCreated && profileData ? (
                  <div className="profile-details">
                    {profileData.profileImage && (
                      <div className="profile-image">
                        <img
                          src={profileData.profileImage}
                          alt="Profile"
                          className="profile-img"
                        />
                      </div>
                    )}
                    <h3>{profileData.fullName}</h3>
                    <div className="profile-info-grid">
                      <div className="info-item">
                        <i className="fas fa-phone"></i>
                        <span>{profileData.phoneNumber}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-id-card"></i>
                        <span>License: {profileData.licenseNumber}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-briefcase"></i>
                        <span>{profileData.YearsOfExperience} years experience</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{profileData.currentWorkingLocation}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-money-bill-wave"></i>
                        <span>ETB {profileData.minPriceInETB} consultation fee</span>
                      </div>
                    </div>
                    <Link to={'/updateLawyerProfile'}>
                      <button className="edit-profile-btn">
                        <i className="fas fa-edit"></i> Edit Profile
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="profile-card">
                    <h2>Your Profile</h2>
                    <div className="profile-image-container">
                      <div className="empty-image-placeholder">
                        <i className="fas fa-user"></i>
                        <p>No profile image</p>
                      </div>
                    </div>
                    <p className="profile-prompt">
                      Complete your profile to start receiving client inquiries and cases.
                    </p>
                    <button
                      className="create-profile-btn"
                      onClick={handleCreateProfile}
                    >
                      <i className="fas fa-plus"></i> Create Profile
                    </button>
                  </div>
                )}
              </div>

              <div className="right-column">
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Active Cases</h3>
                      <p className="stat-number">{stats.cases}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Clients</h3>
                      <p className="stat-number">{stats.clients}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Upcoming Hearings</h3>
                      <p className="stat-number">0</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-file-contract"></i>
                    </div>
                    <div className="stat-info">
                      <h3>Documents</h3>
                      <p className="stat-number">0</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>Recent Activity</h2>
                  <div className="activity-card">
                    <div className="activity-item">
                      <i className="fas fa-info-circle"></i>
                      <p>No recent activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <style jsx>{`
        .lawyer-dashboard-container {
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

        .nav-item:hover,
        .nav-item.active {
          color: white;
        }

        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: white;
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

        .dashboard-main {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 2rem;
        }

        .welcome-section {
          margin-bottom: 2rem;
        }

        .welcome-section h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .welcome-section p {
          color: #7b8a9b;
          font-size: 1.1rem;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .profile-card,
        .activity-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .profile-card h2,
        .recent-activity h2 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .profile-image-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .empty-image-placeholder {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #6c757d;
        }

        .empty-image-placeholder i {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        .profile-prompt {
          text-align: center;
          color: #6c757d;
          margin-bottom: 1.5rem;
          font-style: italic;
          line-height: 1.5;
        }

        .create-profile-btn {
          width: 100%;
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.3s;
        }

        .create-profile-btn:hover {
          opacity: 0.9;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .stat-card {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #e9f2ff;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #4a6580;
          font-size: 1.2rem;
        }

        .stat-info h3 {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          font-weight: normal;
        }

        .stat-number {
          color: #2c3e50;
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
        }

        .recent-activity {
          margin-top: 0;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          width: 100%;
        }

        .loading-content {
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .loading-animation {
          background: white;
          padding: 3rem 2rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .loading-spinner {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
        }

        .spinner-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top: 3px solid #2c3e50;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }

        .spinner-ring:nth-child(1) {
          animation-delay: 0s;
          border-top-color: #2c3e50;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: 0.5s;
          border-top-color: #4a6580;
          width: 70%;
          height: 70%;
          top: 15%;
          left: 15%;
        }

        .spinner-ring:nth-child(3) {
          animation-delay: 1s;
          border-top-color: #3498db;
          width: 50%;
          height: 50%;
          top: 25%;
          left: 25%;
        }

        .spinner-center {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #2c3e50;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .loading-text p {
          color: #7b8a9b;
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .loading-progress {
          margin-top: 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2c3e50, #4a6580);
          border-radius: 3px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          color: #6c757d;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .profile-details {
          background-color: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .profile-image {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .profile-img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #4a6580;
        }

        .profile-details h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin: 1.5rem 0;
          text-align: left;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #f8f9fa;
          padding: 0.8rem;
          border-radius: 6px;
          color: #4a6580;
          font-size: 0.95rem;
        }

        .info-item i {
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .edit-profile-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: opacity 0.3s;
          margin-top: 1rem;
        }

        .edit-profile-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 900px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .dashboard-stats {
            grid-template-columns: 1fr;
          }

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

          .loading-animation {
            padding: 2rem 1rem;
          }

          .loading-text h2 {
            font-size: 1.3rem;
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
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

export default LawyerDashboard;