import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

const UserSignin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/login`, formData, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        navigate('/userPage');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Signin failed. Please check your credentials and try again.');
      console.error('Signin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-signin-container">
      <div className="user-signin-content">
        <div className="signin-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your legal resources, connect with your lawyer, and manage your cases efficiently.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-briefcase"></i>  
              <span>Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-file-alt"></i>    
              <span>Document Access</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-comments"></i>
              <span>Legal Communication</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-calendar-check"></i>
              <span>Appointment Tracking</span>
            </div>
          </div>
        </div>

        <div className="signin-form-wrapper">
          <div className="form-header">
            <h2>Sign In to Your Account</h2>
            <p>Enter your credentials to continue your legal journey</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="user-signin-form">
            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="your.email@example.com"
                className={error ? 'error' : ''}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className={error ? 'error' : ''}
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember" 
                  disabled={isLoading}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Forgot your password?</a>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`signin-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="lawyer-redirect">
            <div className="divider">
              <span>Are you a lawyer?</span>
            </div>
            <button 
              className="lawyer-btn"
              onClick={() => navigate('/lawyerSignin')}
              disabled={isLoading}
            >
              <i className="fas fa-gavel"></i>
              Sign in as Lawyer
            </button>
          </div>

          <div className="signup-redirect">
            <p>Don't have an account? <Link to="/userSignup">Sign Up</Link></p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-signin-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .user-signin-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
        }
        
        .signin-intro {
          background: linear-gradient(135deg, #1a3a5f 0%, #2d5a8c 100%);
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .signin-intro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="rgba(255,255,255,0.05)"><circle cx="50" cy="50" r="2"/><circle cx="20" cy="20" r="1"/><circle cx="80" cy="80" r="1.5"/><circle cx="30" cy="70" r="1"/><circle cx="70" cy="30" r="1.5"/></svg>');
          background-size: 300px;
        }
        
        .logo {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          font-size: 1.5rem;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }
        
        .logo i {
          margin-right: 0.5rem;
          font-size: 2rem;
          color: #ffffff;
        }
        
        .signin-intro h1 {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          position: relative;
          z-index: 1;
          font-weight: 600;
        }
        
        .signin-intro p {
          margin-bottom: 2.5rem;
          line-height: 1.6;
          opacity: 0.95;
          font-size: 1.1rem;
          position: relative;
          z-index: 1;
        }
        
        .benefits {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          position: relative;
          z-index: 1;
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .benefit-item i {
          font-size: 1.3rem;
          width: 25px;
          color: #ffffff;
        }
        
        .benefit-item span {
          font-weight: 500;
        }
        
        .signin-form-wrapper {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: white;
        }
        
        .form-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }
        
        .form-header h2 {
          color: #2d5a8c;
          margin-bottom: 0.5rem;
          font-size: 1.9rem;
          font-weight: 600;
        }
        
        .form-header p {
          color: #6c757d;
          font-size: 1rem;
        }
        
        .error-message {
          background: #ffeaea;
          color: #d32f2f;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-left: 4px solid #d32f2f;
          font-weight: 500;
        }
        
        .error-message i {
          font-size: 1.1rem;
        }
        
        .user-signin-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .input-group {
          display: flex;
          flex-direction: column;
        }
        
        .input-group label {
          color: #495057;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .input-group input {
          padding: 0.9rem;
          border: 2px solid #e9ecef;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }
        
        .input-group input:focus {
          outline: none;
          border-color: #2d5a8c;
          background: white;
          box-shadow: 0 0 0 3px rgba(45, 90, 140, 0.1);
        }
        
        .input-group input.error {
          border-color: #d32f2f;
          background: #fff5f5;
        }
        
        .input-group input:disabled {
          background-color: #f1f3f4;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .input-group input::placeholder {
          color: #adb5bd;
          font-size: 0.9rem;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.5rem 0;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .remember-me input[type="checkbox"] {
          margin: 0;
        }
        
        .remember-me label {
          color: #495057;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .forgot-password a {
          color: #2d5a8c;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .forgot-password a:hover {
          color: #3a7bd5;
          text-decoration: underline;
        }
        
        .signin-btn {
          background: linear-gradient(135deg, #2d5a8c 0%, #3a7bd5 100%);
          color: white;
          border: none;
          padding: 1.1rem;
          border-radius: 6px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          box-shadow: 0 4px 15px rgba(45, 90, 140, 0.2);
        }
        
        .signin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 90, 140, 0.3);
        }
        
        .signin-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .signin-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .signin-btn.loading {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        
        .lawyer-redirect {
          margin: 1.5rem 0;
        }
        
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #e9ecef;
        }
        
        .divider span {
          padding: 0 1rem;
        }
        
        .lawyer-btn {
          width: 100%;
          padding: 0.9rem;
          background: transparent;
          color: #2d5a8c;
          border: 2px solid #2d5a8c;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .lawyer-btn:hover:not(:disabled) {
          background: #2d5a8c;
          color: white;
          transform: translateY(-1px);
        }
        
        .lawyer-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .signup-redirect {
          text-align: center;
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
          color: #6c757d;
        }
        
        .signup-redirect a {
          color: #2d5a8c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .signup-redirect a:hover {
          color: #3a7bd5;
          text-decoration: underline;
        }
        
        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .user-signin-content {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
          
          .signin-intro {
            padding: 2rem;
            text-align: center;
          }
          
          .signin-form-wrapper {
            padding: 2rem;
          }
          
          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
        
        @media (max-width: 480px) {
          .user-signin-container {
            padding: 1rem;
          }
          
          .signin-intro, .signin-form-wrapper {
            padding: 1.5rem;
          }
          
          .signin-intro h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default UserSignin;