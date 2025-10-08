import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';

const DisplayCaseLawyer = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const verifyRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verifyLawyer`, {
          withCredentials: true
        });

        if (verifyRes.data.status) {
          console.log("Verification Success!");
          try {
            const casesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cases/getLawyerCase`, {
              withCredentials: true
            });

            if (casesRes.data.status) {
              console.log("Lawyer Cases Fetched");
              setCases(casesRes.data.cases);
            } else {
              setError("No cases found");
            }
          } catch (error) {
            console.error("Error fetching cases:", error);
            setError("Failed to fetch cases");
          }
        } else {
          setError("Authentication failed. Please sign in again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError("Authentication verification failed");
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'status-pending', text: 'Pending' },
      'In Progress': { class: 'status-progress', text: 'In Progress' },
      'Completed': { class: 'status-completed', text: 'Completed' },
      'Rejected': { class: 'status-rejected', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || null;
    return config ? <span className={`status-badge ${config.class}`}>{config.text}</span> : null;
  };

  const handleSignOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/lawyerAuth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/lawyerSignin');
    }
  };

  // File download
  const downloadFile = (fileData, fileName, fileType) => {
    if (!fileData) return;

    const base64Data = fileData.startsWith("data:") 
      ? fileData 
      : `data:${fileType};base64,${fileData}`;

    fetch(base64Data)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName || "case-file";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        console.error("Download error:", err);
        setError("Failed to download file");
      });
  };

  const openCaseDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  const closeCaseDetails = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  if (loading) {
    return (
      <div className="cases-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-balance-scale"></i>
              <span>Justice Partners</span>
            </div>
            <nav className="dashboard-nav">
              <button className="nav-item" onClick={() => navigate('/lawyerPage')}>
                Dashboard
              </button>
              <button className="nav-item active">My Cases</button>
              <Link to={'/displayAvailability'}> <button className="nav-item">Availability</button></Link>
            </nav>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <main className="cases-main-content">
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
                  <h2>Loading Your Legal Cases</h2>
                  <p>Fetching your assigned cases from our database...</p>
                </div>
                <div className="loading-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span className="progress-text">Loading case details</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <style jsx>{`
          .cases-container {
            min-height: 100vh;
            background-color: #f8f9fa;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .dashboard-header {
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
          
          .dashboard-nav {
            display: flex;
            gap: 1.5rem;
          }
          
          .nav-item {
            background: none;
            border: none;
            color: rgba(255,255,255,0.8);
            cursor: pointer;
            padding: 0.5rem 0;
            font-size: 1rem;
            position: relative;
            transition: color 0.3s;
          }
          
          .nav-item:hover, .nav-item.active {
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
          
          .sign-out-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s;
          }
          
          .sign-out-btn:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .cases-main-content {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 2rem;
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 400px;
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
              justify-content: center;
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

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="cases-container">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo">
              <i className="fas fa-balance-scale"></i>
              <span>Justice Partners</span>
            </div>
            <nav className="dashboard-nav">
              <button className="nav-item" onClick={() => navigate('/lawyerPage')}>
                Dashboard
              </button>
              <button className="nav-item active">My Cases</button>
              <Link to={'/displayAvailability'}> <button className="nav-item">Availability</button></Link>
            </nav>
            <button className="sign-out-btn" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </header>

        <main className="cases-main-content">
          <div className="error-container">
            <div className="error-content">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h2>Error Loading Cases</h2>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i> Try Again
              </button>
            </div>
          </div>
        </main>

        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            min-height: 400px;
          }

          .error-content {
            text-align: center;
            background: white;
            padding: 3rem 2rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
          }

          .error-icon {
            font-size: 4rem;
            color: #e74c3c;
            margin-bottom: 1.5rem;
          }

          .error-content h2 {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 1.8rem;
          }

          .error-content p {
            color: #7b8a9b;
            margin-bottom: 2rem;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .retry-btn {
            background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }

          .retry-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cases-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-item" onClick={() => navigate('/lawyerPage')}>
              Dashboard
            </button>
            <button className="nav-item active">My Cases</button>
            <Link to={'/displayAvailability'}> <button className="nav-item">Availability</button></Link>
          </nav>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="cases-main-content">
        <div className="cases-header">
          <h1>My Legal Cases</h1>
          <p>Manage all your assigned legal cases</p>
          <div className="cases-stats">
            <div className="stat-card">
              <div className="stat-icon total">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="stat-info">
                <span className="stat-number">{cases.length}</span>
                <span className="stat-label">Total Cases</span>
              </div>
            </div>  
          </div>
        </div>
        {cases.length === 0 ? (
          <div className="no-cases-container">
            <div className="no-cases-content">
              <div className="no-cases-illustration">
                <i className="fas fa-folder-open"></i>
                <div className="illustration-circle"></div>
                <div className="illustration-circle circle-2"></div>
              </div>
              <div className="no-cases-text">
                <h2>No Cases Assigned Yet</h2>
                <p>You haven't been assigned any legal cases at the moment. New cases will appear here once they are assigned to you by the system.</p>
                <div className="no-cases-tips">
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Ensure your profile is complete and verified</span>
                  </div>
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Keep your availability schedule up to date</span>
                  </div>
                  <div className="tip-item">
                    <i className="fas fa-check-circle"></i>
                    <span>Check back regularly for new assignments</span>
                  </div>
                </div>
                <div className="no-cases-actions">
                  <button className="action-btn primary" onClick={() => navigate('/lawyerPage')}>
                    <i className="fas fa-home"></i> Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="cases-grid">
            {cases.map((caseItem, index) => (
              <div key={caseItem._id || index} className="case-card">
                <div className="case-header">
                  <h3>{caseItem.caseTitle}</h3>
                  {getStatusBadge(caseItem.status)}
                </div>
                
                <div className="case-type">
                  <i className="fas fa-tag"></i>
                  <span>{caseItem.caseType}</span>
                </div>
                
                <div className="case-description">
                  <p>{caseItem.caseDiscription}</p>
                </div>

                {/* Compact File Section */}
                {caseItem.caseFile && (
                  <div className="compact-file-section">
                    <div className="file-info">
                      <i className="fas fa-file-pdf"></i>
                      <div className="file-details">
                        <span className="file-name">{caseItem.caseTitle || "case-file"}.pdf</span>
                        <span className="file-type">PDF Document</span>
                      </div>
                    </div>
                    <button
                      className="compact-download-btn"
                      onClick={() =>
                        downloadFile(caseItem.caseFile, `${caseItem.caseTitle || "case-file"}.pdf`, "application/pdf")
                      }
                      title="Download file"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                  </div>
                )}
                
                <div className="case-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <div className="detail-content">
                        <span className="detail-label">Client</span>
                        <span className="detail-value">
                          {caseItem.client?.firstName || 'Not specified'}
                          {" "}
                          {caseItem.client?.middleName || ''}
                          {caseItem.client?.lastName ? ` ${caseItem.client.lastName}` : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <i className="fas fa-calendar-alt"></i>
                      <div className="detail-content">
                        <span className="detail-label">Created</span>
                        <span className="detail-value">
                          {formatDate(caseItem.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <div className="detail-content">
                        <span className="detail-label">Client Email</span>
                        <span className="detail-value">
                          {caseItem.client?.email || 'Not available'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <i className="fas fa-phone"></i>
                      <div className="detail-content">
                        <span className="detail-label">Client Phone</span>
                        <span className="detail-value">
                          {caseItem.client?.phoneNumber || 'Not available'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {caseItem.appointmentTime && (
                    <div className="detail-item full-width">
                      <i className="fas fa-clock"></i>
                      <div className="detail-content">
                        <span className="detail-label">Appointment</span>
                        <span className="detail-value">
                          {caseItem.appointmentTime.availableDate ? 
                            formatDate(caseItem.appointmentTime.availableDate) : 
                            'Scheduled'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="case-actions">
                  <button className="action-btn view-btn" onClick={() => openCaseDetails(caseItem)}>
                    <i className="fas fa-eye"></i> View Case Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Case Details Modal */}
      {isModalOpen && selectedCase && (
        <div className="modal-overlay" onClick={closeCaseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCase.caseTitle}</h2>
              <button className="modal-close-btn" onClick={closeCaseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Case Information</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Case Type</span>
                    <span className="modal-detail-value">{selectedCase.caseType}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Status</span>
                    <span className="modal-detail-value">{getStatusBadge(selectedCase.status)}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Date Created</span>
                    <span className="modal-detail-value">{formatDate(selectedCase.createdAt)}</span>
                  </div>
                  {selectedCase.updatedAt && (
                    <div className="modal-detail-item">
                      <span className="modal-detail-label">Last Updated</span>
                      <span className="modal-detail-value">{formatDate(selectedCase.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-section">
                <h3>Case Description</h3>
                <p className="modal-description">{selectedCase.caseDiscription}</p>
              </div>
              
              <div className="modal-section">
                <h3>Client Information</h3>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Name</span>
                    <span className="modal-detail-value">
                      {selectedCase.client?.firstName || 'Not specified'}
                      {" "}
                      {selectedCase.client?.middleName || ''}
                      {selectedCase.client?.lastName ? ` ${selectedCase.client.lastName}` : ''}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Email</span>
                    <span className="modal-detail-value">{selectedCase.client?.email || 'Not available'}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Phone</span>
                    <span className="modal-detail-value">{selectedCase.client?.phoneNumber || 'Not available'}</span>
                  </div>
                </div>
              </div>
              
              {selectedCase.caseFile && (
                <div className="modal-section">
                  <h3>Case Documents</h3>
                  <div className="modal-file-section">
                    <div className="modal-file-info">
                      <i className="fas fa-file-pdf"></i>
                      <div className="modal-file-details">
                        <span className="modal-file-name">{selectedCase.caseTitle || "case-file"}.pdf</span>
                        <span className="modal-file-type">PDF Document</span>
                      </div>
                    </div>
                    <button
                      className="modal-download-btn"
                      onClick={() =>
                        downloadFile(selectedCase.caseFile, `${selectedCase.caseTitle || "case-file"}.pdf`, "application/pdf")
                      }
                    >
                      <i className="fas fa-download"></i> Download File
                    </button>
                  </div>
                </div>
              )}
              
              {selectedCase.appointmentTime && (
                <div className="modal-section">
                  <h3>Appointment Information</h3>
                  <div className="modal-details-grid">
                    <div className="modal-detail-item">
                      <span className="modal-detail-label">Appointment Date & Time</span>
                      <span className="modal-detail-value">
                        {selectedCase.appointmentTime.availableDate ? 
                          formatDate(selectedCase.appointmentTime.availableDate) : 
                          'Scheduled'
                        }
                      </span>
                    </div>
                    {selectedCase.appointmentTime.notes && (
                      <div className="modal-detail-item full-width">
                        <span className="modal-detail-label">Appointment Notes</span>
                        <span className="modal-detail-value">{selectedCase.appointmentTime.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-close-button" onClick={closeCaseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cases-container {
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-header {
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
        
        .dashboard-nav {
          display: flex;
          gap: 1.5rem;
        }
        
        .nav-item {
          background: none;
          border: none;
          color: rgba(255,255,255,0.8);
          cursor: pointer;
          padding: 0.5rem 0;
          font-size: 1rem;
          position: relative;
          transition: color 0.3s;
        }
        
        .nav-item:hover, .nav-item.active {
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
        
        .sign-out-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        
        .sign-out-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .cases-main-content {
          max-width: 1400px;
          margin: 2rem auto;
          padding: 0 2rem;
        }
        
        .cases-header {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .cases-header h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }
        
        .cases-header p {
          color: #7b8a9b;
          margin-bottom: 1.5rem;
        }

        .cases-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e9ecef;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.total {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
        }

        .stat-icon.pending {
          background: linear-gradient(135deg, #ffc107 0%, #ffd54f 100%);
          color: #856404;
        }

        .stat-icon.progress {
          background: linear-gradient(135deg, #17a2b8 0%, #6fdaee 100%);
          color: #004085;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 2rem;
        }
        
        .case-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          border: 1px solid #e9ecef;
        }
        
        .case-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .case-header {
          padding: 1.8rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }
        
        .case-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.3rem;
          flex: 1;
          margin-right: 1rem;
          font-weight: 600;
        }
        
        .status-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-progress {
          background-color: #cce5ff;
          color: #004085;
        }
        
        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .case-type {
          padding: 0.8rem 1.8rem;
          background-color: #f0f4f8;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #4a6580;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .case-description {
          padding: 1.2rem 1.8rem;
          flex: 1;
          border-bottom: 1px solid #e9ecef;
        }
        
        .case-description p {
          color: #5a6c7d;
          margin: 0;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Compact File Section */
        .compact-file-section {
          padding: 1rem 1.8rem;
          border-top: 1px solid #e9ecef;
          background: #fafbfc;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex: 1;
        }
        
        .file-info i {
          color: #e74c3c;
          font-size: 1.5rem;
        }
        
        .file-details {
          display: flex;
          flex-direction: column;
        }
        
        .file-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        
        .file-type {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .compact-download-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(44, 62, 80, 0.2);
        }
        
        .compact-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(44, 62, 80, 0.3);
          background: linear-gradient(135deg, #34495e 0%, #506880 100%);
        }
        
        .case-details {
          padding: 1.5rem 1.8rem;
        }
        
        .detail-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.2rem;
          justify-content: flex-start;
        }
        
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          flex: 1;
          min-width: 0;
        }
        
        .detail-item.full-width {
          flex: 0 0 100%;
          margin-top: 0.5rem;
        }
        
        .detail-item i {
          color: #4a6580;
          font-size: 1.1rem;
          margin-top: 0.2rem;
          min-width: 20px;
          text-align: center;
        }
        
        .detail-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        
        .detail-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.3rem;
          font-weight: 600;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 0.95rem;
          color: #2c3e50;
          font-weight: 500;
          text-align: left;
          word-wrap: break-word;
          line-height: 1.4;
        }
        
        .case-actions {
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }
        
        .action-btn {
          padding: 1rem 1.5rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .view-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .view-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: 0.5s;
        }
        
        .view-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
        }
        
        .view-btn:hover::before {
          left: 100%;
        }

        /* No Cases Container */
        .no-cases-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 500px;
          width: 100%;
        }

        .no-cases-content {
          background: white;
          border-radius: 20px;
          padding: 4rem 3rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          width: 100%;
          border: 1px solid #e9ecef;
        }

        .no-cases-illustration {
          position: relative;
          margin-bottom: 2rem;
          display: inline-block;
        }

        .no-cases-illustration i {
          font-size: 5rem;
          color: #bdc3c7;
          position: relative;
          z-index: 2;
        }

        .illustration-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 50%;
          z-index: 1;
        }

        .illustration-circle.circle-2 {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #f1f3f4 0%, #e5e8eb 100%);
          opacity: 0.7;
        }

        .no-cases-text h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: 700;
        }

        .no-cases-text p {
          color: #7b8a9b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .no-cases-tips {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }

        .tip-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
        }

        .tip-item:last-child {
          margin-bottom: 0;
        }

        .tip-item i {
          color: #27ae60;
          font-size: 1.1rem;
          min-width: 20px;
        }

        .tip-item span {
          color: #5a6c7d;
          font-size: 1rem;
        }

        .no-cases-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .no-cases-actions .action-btn {
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-transform: none;
          letter-spacing: normal;
          width: auto;
          min-width: 180px;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
        }

        .action-btn.secondary {
          background: transparent;
          color: #2c3e50;
          border: 2px solid #2c3e50;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          overflow-y: auto;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .modal-header h2 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.5rem;
        }
        
        .modal-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6c757d;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        
        .modal-close-btn:hover {
          background-color: #f8f9fa;
          color: #2c3e50;
        }
        
        .modal-body {
          padding: 2rem;
          flex: 1;
          overflow-y: auto;
        }
        
        .modal-section {
          margin-bottom: 2.5rem;
        }
        
        .modal-section:last-child {
          margin-bottom: 0;
        }
        
        .modal-section h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e9ecef;
        }
        
        .modal-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .modal-detail-item {
          display: flex;
          flex-direction: column;
        }
        
        .modal-detail-item.full-width {
          grid-column: 1 / -1;
        }
        
        .modal-detail-label {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .modal-detail-value {
          font-size: 1rem;
          color: #2c3e50;
          font-weight: 500;
          word-break: break-word;
        }
        
        .modal-description {
          color: #5a6c7d;
          line-height: 1.6;
          font-size: 1rem;
          margin: 0;
        }
        
        .modal-file-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background-color: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e9ecef;
        }
        
        .modal-file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .modal-file-info i {
          color: #e74c3c;
          font-size: 2.5rem;
        }
        
        .modal-file-details {
          display: flex;
          flex-direction: column;
        }
        
        .modal-file-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1.1rem;
          margin-bottom: 0.3rem;
        }
        
        .modal-file-type {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .modal-download-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.8rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(44, 62, 80, 0.25);
        }
        
        .modal-download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(44, 62, 80, 0.35);
          background: linear-gradient(135deg, #34495e 0%, #506880 100%);
        }
        
        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          position: sticky;
          bottom: 0;
        }
        
        .modal-close-button {
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.8rem 1.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .modal-close-button:hover {
          background: #5a6268;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 1024px) {
          .cases-grid {
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 1.5rem;
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
            justify-content: center;
          }
          
          .cases-main-content {
            padding: 0 1rem;
            max-width: 100%;
          }
          
          .cases-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .case-card {
            margin: 0 0.5rem;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          
          .case-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .case-header h3 {
            margin-right: 0;
          }
          
          .cases-stats {
            grid-template-columns: 1fr;
          }
          
          .no-cases-content {
            padding: 2rem 1.5rem;
            margin: 1rem;
          }
          
          .no-cases-text h2 {
            font-size: 1.5rem;
          }
          
          .no-cases-actions {
            flex-direction: column;
          }
          
          .no-cases-actions .action-btn {
            width: 100%;
          }
          
          .modal-overlay {
            padding: 1rem;
          }
          
          .modal-content {
            max-height: 95vh;
          }
          
          .modal-body {
            padding: 1.5rem;
          }
          
          .modal-details-grid {
            grid-template-columns: 1fr;
          }
          
          .modal-file-section {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .modal-download-btn {
            align-self: stretch;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .cases-header {
            padding: 1.5rem;
          }
          
          .cases-header h1 {
            font-size: 1.8rem;
          }
          
          .case-card {
            margin: 0;
          }
          
          .case-header, .case-type, .case-description, .case-details, .case-actions, .compact-file-section {
            padding: 1.2rem;
          }
          
          .modal-header, .modal-footer {
            padding: 1.2rem;
          }
          
          .modal-body {
            padding: 1rem;
          }
        }
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default DisplayCaseLawyer;