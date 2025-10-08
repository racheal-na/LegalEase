import { useState, useEffect } from "react";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { Link, useNavigate } from "react-router";

const UserPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const verifyRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/clientAuth/verifyUser`,
          {
            withCredentials: true,
          }
        );

        if (verifyRes.data.status) {
          try {
            const profileRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/lawyerProfile/getProfile`,
              {
                withCredentials: true,
              }
            );

            if (profileRes.status === 200) {
              setProfiles(profileRes.data);
              console.log("Data is Fetched", profileRes.data);
            } else {
              console.log("Cannot Fetch Profile");
              setError("Cannot fetch profile data");
            }
          } catch (error) {
            console.log("Cannot fetch data", error);
            setError("Error fetching profile data");
          }
        } else {
          setError("User not verified");
        }
      } catch (error) {
        console.log("Verification error:", error);
        setError("Verification failed");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleSelectLawyer = (lawyerId) => {
    console.log("Selected lawyer:", lawyerId);
    navigate("/createCase", { state: { lawyerId } });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/clientAuth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
      navigate("/userSignin");
    }
  };

  return (
    <div className="user-page-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-item active">Find Lawyers</button>
            <Link to={"/displayUserCases"}>
              <button className="nav-item">My Cases</button>
            </Link>
            <Link to={"/futureWork"}>
              <button className="nav-item">Future Work</button>
            </Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="user-main-content">
        {loading ? (
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
                  <h2>Finding the Best Legal Experts</h2>
                  <p>Loading qualified lawyers from our network...</p>
                </div>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Loading profiles</span>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              className="retry-btn" 
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="welcome-section">
              <h1>Find Your Legal Expert</h1>
              <p>
                Browse through our network of qualified lawyers and select the right
                one for your needs
              </p>
            </div>

            <div className="profiles-container">
              {profiles.length > 0 ? (
                profiles.map((profile, index) => (
                  <div key={index} className="lawyer-profile-card-wide">
                    <div className="profile-header">
                      <div className="circular-image-container">
                        {profile.profileImage ? (
                          <img
                            src={profile.profileImage}
                            alt={profile.fullName}
                            className="circular-profile-img"
                          />
                        ) : (
                          <div className="empty-circular-image">
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                      </div>
                      <h3>{profile.fullName}</h3>
                    </div>

                    <div className="profile-details-wide">
                      <div className="details-grid">
                        <div className="detail-item">
                          <i className="fas fa-phone"></i>
                          <div className="detail-content">
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">
                              {profile.phoneNumber}
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="fas fa-id-card"></i>
                          <div className="detail-content">
                            <span className="detail-label">License Number</span>
                            <span className="detail-value">
                              {profile.licenseNumber}
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="fas fa-briefcase"></i>
                          <div className="detail-content">
                            <span className="detail-label">Experience</span>
                            <span className="detail-value">
                              {profile.YearsOfExperience} years
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="fas fa-map-marker-alt"></i>
                          <div className="detail-content">
                            <span className="detail-label">Location</span>
                            <span className="detail-value">
                              {profile.currentWorkingLocation}
                            </span>
                          </div>
                        </div>

                        <div className="detail-item">
                          <i className="fas fa-money-bill-wave"></i>
                          <div className="detail-content">
                            <span className="detail-label">Consultation Fee</span>
                            <span className="detail-value">
                              ETB {profile.minPriceInETB}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="button-container">
                        <button
                          className="select-lawyer-btn-wide"
                          onClick={() => handleSelectLawyer(profile._id || index)}
                        >
                          <i className="fas fa-check-circle"></i> Select Lawyer
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-profiles">
                  <i className="fas fa-search"></i>
                  <h3>No Lawyers Found</h3>
                  <p>There are currently no lawyers available in our network.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <style jsx>{`
        .user-page-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: white;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .user-main-content {
          max-width: 1000px;
          margin: 2rem auto;
          padding: 0 2rem;
          min-height: 60vh;
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

        /* Error Styles */
        .error-container {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          max-width: 600px;
          margin: 2rem auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .error-container h2 {
          color: #e74c3c;
          margin-bottom: 1rem;
        }

        .retry-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          margin-top: 1rem;
        }

        .retry-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        /* Existing Styles */
        .welcome-section {
          margin-bottom: 2rem;
          text-align: center;
        }

        .welcome-section h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }

        .welcome-section p {
          color: #7b8a9b;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .profiles-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .lawyer-profile-card-wide {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .lawyer-profile-card-wide:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .profile-header {
          width: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
        }

        .circular-image-container {
          margin-bottom: 1.5rem;
        }

        .circular-profile-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .empty-circular-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 2.5rem;
          border: 4px solid white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .profile-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.4rem;
          text-align: center;
          font-weight: 600;
        }

        .profile-details-wide {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          text-align: left;
        }

        .detail-item i {
          color: #4a6580;
          font-size: 1.2rem;
          margin-top: 0.2rem;
          min-width: 20px;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          text-align: left;
          align-items: flex-start;
        }

        .detail-label {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 0.2rem;
          font-weight: 500;
          text-align: left;
        }

        .detail-value {
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 500;
          text-align: left;
          word-break: break-word;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          margin-top: auto;
          padding-top: 1.5rem;
        }

        .select-lawyer-btn-wide {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .select-lawyer-btn-wide:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .no-profiles {
          text-align: center;
          padding: 3rem;
          color: #6c757d;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .no-profiles i {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: #bdc3c7;
        }

        .no-profiles h3 {
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        @media (max-width: 900px) {
          .lawyer-profile-card-wide {
            flex-direction: column;
          }

          .profile-header {
            width: 100%;
            padding: 1.5rem;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .button-container {
            justify-content: center;
          }

          .loading-animation {
            padding: 2rem 1rem;
          }

          .loading-text h2 {
            font-size: 1.3rem;
          }
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

          .logout-btn {
            order: 4;
            margin-top: 0.5rem;
          }

          .user-main-content {
            padding: 0 1rem;
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

export default UserPage;