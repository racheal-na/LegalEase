import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { PropagateLoader } from 'react-spinners';


const DisplayCaseUser = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const verifyRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/verifyUser`, {
          withCredentials: true
        });

        if (verifyRes.data.status) {
          try {
            const casesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cases/getUserCase`, {
              withCredentials: true
            });

            if (casesRes.data.status && casesRes.data.cases && casesRes.data.cases.length > 0) {
              setCases(casesRes.data.cases);
              setError('');
            } else {
              setCases([]);
              setError('');
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
      'In Progress': { class: 'status-progress', text: 'In Progress' },
      'Completed': { class: 'status-completed', text: 'Completed' },
      'Rejected': { class: 'status-rejected', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || null;
    return config ? <span className={`status-badge ${config.class}`}>{config.text}</span> : null;
  };

  const handleSignOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/userSignin');
    }
  };

  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setShowModal(true);
    setPreviewFile(null);  // Reset preview when opening a new case
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCase(null);
    setPreviewFile(null);
  };

 const downloadFile = (fileData, fileName, fileType) => {
  if (!fileData) return;

  try {
    let base64Data;

    // Ensure it's a valid base64 Data URL
    if (fileData.startsWith("data:")) {
      base64Data = fileData;
    } else {
      base64Data = `data:${fileType};base64,${fileData}`;
    }

    // Fetch converts base64 data URL into a blob properly
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
      });
  } catch (error) {
    console.error("Error downloading file:", error);
    setError("Failed to download file");
  }
};

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType?.includes('image')) return 'fas fa-file-image';
    if (fileType?.includes('word')) return 'fas fa-file-word';
    return 'fas fa-file';
  };

  const getFileTypeName = (fileType) => {
    if (fileType?.includes('pdf')) return 'PDF Document';
    if (fileType?.includes('image')) return 'Image File';
    if (fileType?.includes('word')) return 'Word Document';
    return 'Document';
  };

  const handlePreviewFile = (fileData, fileType) => {
    setPreviewFile({ data: fileData, type: fileType });
  };

  const renderFilePreview = () => {
    if (!previewFile) return null;
    
    if (previewFile.type.includes('pdf')) {
      return (
        <div className="pdf-preview">
          <iframe 
            src={previewFile.data} 
            className="pdf-iframe" 
            title="PDF Preview"
          />
          <div className="preview-actions">
            <button 
              className="download-btn"
              onClick={() => downloadFile(previewFile.data, 'case-document.pdf', previewFile.type)}
            >
              <i className="fas fa-download"></i> Download PDF
            </button>
          </div>
        </div>
      );
    } else if (previewFile.type.includes('image')) {
      return (
        <div className="image-preview-modal">
          <img 
            src={previewFile.data} 
            alt="Case document" 
            className="preview-image"
          />
          <div className="preview-actions">
            <button 
              className="download-btn"
              onClick={() => downloadFile(previewFile.data, 'case-image.jpg', previewFile.type)}
            >
              <i className="fas fa-download"></i> Download Image
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="unsupported-preview">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Preview not available for this file type. Please download to view.</p>
          <div className="preview-actions">
            <button 
              className="download-btn"
              onClick={() => downloadFile(previewFile.data, 'case-file', previewFile.type)}
            >
              <i className="fas fa-download"></i> Download File
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="cases-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <nav className="dashboard-nav">
            <button className="nav-item" onClick={() => navigate('/userPage')}>
              Find Lawyers
            </button>
            
             <button className="nav-item active">My Cases</button>

             <Link to={'/futureWork'}><button className="nav-item ">Future Work</button></Link>
          </nav>
          <button className="sign-out-btn" onClick={handleSignOut}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      <main className="cases-main-content">
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
                  <h2>Loading Your Legal Cases</h2>
                  <p>Retrieving your case information and documents...</p>
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
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Error Loading Cases</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="cases-header">
              <h1>My Legal Cases</h1>
              <p>Track the status of all your legal matters in one place</p>
            </div>

            {cases.length === 0 ? (
              <div className="no-cases">
                <div className="no-cases-illustration">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3>No Cases Yet</h3>
                <p>You haven't created any legal cases yet. Start by selecting a lawyer to handle your case.</p>
                <div className="no-cases-actions">
                  <button 
                    className="find-lawyer-btn"
                    onClick={() => navigate('/userPage')}
                  >
                    <i className="fas fa-search"></i> Find a Lawyer
                  </button>
                  <button 
                    className="learn-more-btn"
                    onClick={() => navigate('/futureWork')}
                  >
                    <i className="fas fa-info-circle"></i> Learn More
                  </button>
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
                    
                    {caseItem.caseFile && (
                      <div className="file-attachment">
                        <div className="file-preview">
                          <i className={getFileIcon(caseItem.caseFileType)}></i>
                          <div className="file-info">
                            <span className="file-type">
                              {getFileTypeName(caseItem.caseFileType)}
                            </span>
                            <span className="file-size">
                              {Math.round(caseItem.caseFile.length / 1024)} KB
                            </span>
                          </div>
                          <button 
                            className="download-icon-btn"
                            onClick={() => downloadFile(caseItem.caseFile, `case-file-${caseItem.caseTitle}`, caseItem.caseFileType)}
                            title="Download file"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    )}
                       
                    
                    <div className="case-details">
                      <div className="detail-row">
                        <div className="detail-item">
                          <i className="fas fa-user-graduate"></i>
                          <div className="detail-content">
                            <span className="detail-label">Lawyer</span>
                            <span className="detail-value">
                              {caseItem.lawyer?.fullName || 'Not assigned'}
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
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewDetails(caseItem)}>
                        <i className="fas fa-eye"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showModal && selectedCase && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCase.caseTitle}</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Case Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Case Type</span>
                    <span className="detail-value">{selectedCase.caseType}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Created On</span>
                    <span className="detail-value">
                      {formatDate(selectedCase.createdAt)}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Assigned Lawyer</span>
                    <span className="detail-value">
                      {selectedCase.lawyer?.fullName || 'Not assigned'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="modal-section">
                <h3>Case Description</h3>
                <p className="case-description-full">
                  {selectedCase.caseDiscription}
                </p>
              </div>
              
              {selectedCase.caseFile && (
                <div className="modal-section">
                  <h3>Attached File</h3>
                  <div className="file-attachment-modal">
                    <div className="file-preview-modal">
                      <i className={getFileIcon(selectedCase.caseFileType)}></i>
                      <div className="file-info">
                        <span className="file-name">
                          {getFileTypeName(selectedCase.caseFileType)}
                        </span>
                        <span className="file-size">
                          {Math.round(selectedCase.caseFile.length / 1024)} KB
                        </span>
                      </div>
                      <button 
                        className="download-btn"
                        onClick={() => downloadFile(selectedCase.caseFile, `case-file-${selectedCase.caseTitle}`, selectedCase.caseFileType)}
                      >
                        <i className="fas fa-download"></i> Download
                      </button>
                    </div>
                    
                    {previewFile && renderFilePreview()}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="modal-btn close-btn" onClick={closeModal}>
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
          max-width: 1200px;
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
        
        .cases-header {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .cases-header h1 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }
        
        .cases-header p {
          color: #7b8a9b;
          margin-bottom: 1.5rem;
          max-width: 600px;
        }
        
        .create-case-btn {
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
        
        .create-case-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Enhanced No Cases Styles */
        .no-cases {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          max-width: 600px;
          margin: 2rem auto;
        }

        .no-cases-illustration {
          margin-bottom: 2rem;
        }

        .no-cases-illustration i {
          font-size: 5rem;
          color: #bdc3c7;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .no-cases h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .no-cases p {
          color: #7b8a9b;
          margin-bottom: 2.5rem;
          font-size: 1.1rem;
          line-height: 1.6;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .no-cases-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .find-lawyer-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .find-lawyer-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .learn-more-btn {
          background: transparent;
          color: #4a6580;
          border: 2px solid #4a6580;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .learn-more-btn:hover {
          background: #4a6580;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .cases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .case-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .case-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        
        .case-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        
        .case-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.2rem;
          flex: 1;
          margin-right: 1rem;
        }
        
        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
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
          padding: 0.5rem 1.5rem;
          background-color: #f0f4f8;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a6580;
          font-weight: 500;
        }
        
        .case-description {
          padding: 1rem 1.5rem;
          flex: 1;
        }
        
        .case-description p {
          color: #5a6c7d;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* File Attachment Styles */
        .file-attachment {
          padding: 0 1.5rem;
          margin-bottom: 1rem;
        }
        
        .file-preview {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          position: relative;
        }
        
        .file-preview i {
          font-size: 1.5rem;
          color: #e74c3c;
        }
        
        .file-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        
        .file-type {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .file-size {
          font-size: 0.8rem;
          color: #6c757d;
        }
        
        .download-icon-btn {
          background: none;
          border: none;
          color: #4a6580;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .download-icon-btn:hover {
          background-color: #e9ecef;
          color: #2c3e50;
        }
        
        .case-details {
          padding: 0 1.5rem 1rem;
        }
        
        .detail-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          justify-content: flex-start;
        }
        
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          flex: 0 1 auto;
          min-width: 0;
        }
        
        .detail-item.full-width {
          flex: 0 0 100%;
        }
        
        .detail-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        
        .detail-label {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 0.2rem;
          font-weight: 500;
          text-align: left;
        }
        
        .detail-value {
          font-size: 0.9rem;
          color: #2c3e50;
          font-weight: 500;
          text-align: left;
          word-wrap: break-word;
        }
        
        .case-actions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 0.8rem;
        }
        
        .action-btn {
          padding: 0.8rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
          width: 100%;
        }
        
        .view-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
          color: white;
          border: none;
        }
        
        .view-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e9ecef;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }
        
        .modal-header h2 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.5rem;
        }
        
        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #6c757d;
          padding: 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
        }
        
        .modal-close:hover {
          color: #e74c3c;
          background-color: #f8f9fa;
        }
        
        .modal-body {
          padding: 2rem;
        }
        
        .modal-section {
          margin-bottom: 2rem;
        }
        
        .modal-section h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 0.5rem;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .case-description-full {
          color: 5a6c7d;
          line-height: 1.6;
          margin: 0;
        }
        
        /* File Attachment in Modal */
        .file-attachment-modal {
          margin-top: 1rem;
        }
        
        .file-preview-modal {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          margin-bottom: 1rem;
        }
        
        .file-preview-modal i {
          font-size: 2rem;
          color: #e74c3c;
        }
        
        .file-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .download-btn, .preview-btn {
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        
        .download-btn {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6580 100%);
        }
        
        .preview-btn {
          background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
          margin-left: 0.5rem;
        }
        
        .download-btn:hover, .preview-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        /* PDF Preview */
        .pdf-preview {
          margin-top: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .pdf-iframe {
          width: 100%;
          height: 400px;
          border: none;
        }
        
        .preview-actions {
          padding: 1rem;
          background-color: #f8f9fa;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: center;
        }
        
        /* Image Preview */
        .image-preview-modal {
          margin-top: 1rem;
          text-align: center;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        /* Unsupported Preview */
        .unsupported-preview {
          text-align: center;
          padding: 2rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          margin-top: 1rem;
          border: 1px solid #e9ecef;
        }
        
        .unsupported-preview i {
          font-size: 2rem;
          color: #f39c12;
          margin-bottom: 1rem;
        }
        
        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
        }
        
        .modal-btn {
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .close-btn {
          background: #6c757d;
          color: white;
          border: none;
        }
        
        .close-btn:hover {
          background: #5a6268;
        }
        
        .error-container {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          max-width: 600px;
          margin: 2rem auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .error-container i {
          font-size: 3rem;
          color: #e74c3c;
          margin-bottom: 1rem;
        }
        
        .error-container h2 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .error-container p {
          color: #7b8a9b;
          margin-bottom: 1.5rem;
        }
        
        .retry-btn {
          background: #4a6580;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .retry-btn:hover {
          background: #3a556c;
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
          
          .cases-main-content {
            padding: 0 1rem;
          }
          
          .cases-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 0.8rem;
          }
          
          .case-actions {
            flex-direction: column;
          }
          
          .modal-overlay {
            padding: 1rem;
          }
          
          .modal-content {
            max-height: 95vh;
          }
          
          .file-preview-modal {
            flex-direction: column;
            text-align: center;
          }
          
          .download-btn, .preview-btn {
            margin-left: 0;
            margin-top: 1rem;
            width: 100%;
          }
          
          .pdf-iframe {
            height: 300px;
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

          .no-cases {
            padding: 3rem 1.5rem;
          }

          .no-cases-illustration i {
            font-size: 4rem;
          }

          .no-cases-actions {
            flex-direction: column;
            align-items: center;
          }

          .find-lawyer-btn, .learn-more-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default DisplayCaseUser;