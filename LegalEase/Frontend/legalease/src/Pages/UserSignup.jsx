import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',   
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.confirmPassword !== formData.password) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/clientAuth/signup`, formData);
      if (response.status === 200) {
        navigate('/userSignin');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-signup-container">
      <div className="user-signup-content">
        <div className="signup-intro">
          <div className="logo">
            <i className="fas fa-balance-scale"></i>
            <span>Justice Partners</span>
          </div>
          <h1>Find Your Legal Solution</h1>
          <p>Create an account to connect with qualified lawyers, manage your cases, and access legal resources tailored to your needs.</p>
          <div className="benefits">
            <div className="benefit-item">
              <i className="fas fa-search"></i>
              <span>Find Qualified Lawyers</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-lock"></i>
              <span>Secure Case Management</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-comments"></i>
              <span>Direct Communication</span>
            </div>
            <div className="benefit-item">
              <i className="fas fa-clock"></i>
              <span>24/7 Access</span>
            </div>
          </div>
        </div>

        <div className="signup-form-wrapper">
          <div className="form-header">
            <h2>Create Client Account</h2>
            <p>Please provide your information to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="user-signup-form">
            <div className="name-fields">
              <div className="input-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="John"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="middleName">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Michael"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Doe"
                />
              </div>
            </div>
            
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
                disabled={isLoading}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="password-fields">
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
                  placeholder="Create a strong password"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            
            <div className="terms-agreement">
              <input 
                type="checkbox" 
                id="terms" 
                required 
                disabled={isLoading}
              />
              <label htmlFor="terms">
                I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
              </label>
            </div>
            
            <button 
              type="submit" 
              className={`signup-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="signin-redirect">
            <p>Already have an account? <Link to="/userSignin">Sign In</Link></p>
          </div>

          <div className="lawyer-redirect">
            <div className="divider">
              <span>Are you a lawyer?</span>
            </div>
            <button 
              className="lawyer-btn"
              onClick={() => navigate('/lawyerSignup')}
              disabled={isLoading}
            >
              <i className="fas fa-gavel"></i>
              Register as a Lawyer
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .user-signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .user-signup-content {
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
        
        .signup-intro {
          background: linear-gradient(135deg, #1a3a5f 0%, #2d5a8c 100%);
          color: white;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .signup-intro::before {
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
        
        .signup-intro h1 {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
          line-height: 1.3;
          position: relative;
          z-index: 1;
          font-weight: 600;
        }
        
        .signup-intro p {
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
        
        .signup-form-wrapper {
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
        
        .user-signup-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        
        .password-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
        
        .input-group input:disabled {
          background-color: #f1f3f4;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .input-group input::placeholder {
          color: #adb5bd;
          font-size: 0.9rem;
        }
        
        .terms-agreement {
          display: flex;
          align-items: flex-start;
          gap: 0.7rem;
          margin: 1rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
        }
        
        .terms-agreement input[type="checkbox"] {
          margin-top: 0.2rem;
        }
        
        .terms-agreement label {
          color: #495057;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .terms-agreement a {
          color: #2d5a8c;
          text-decoration: none;
          font-weight: 500;
        }
        
        .terms-agreement a:hover {
          text-decoration: underline;
        }
        
        .signup-btn {
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
        
        .signup-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 90, 140, 0.3);
        }
        
        .signup-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .signup-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .signup-btn.loading {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        }
        
        .signin-redirect {
          text-align: center;
          margin: 1.5rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 6px;
          color: #6c757d;
        }
        
        .signin-redirect a {
          color: #2d5a8c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        
        .signin-redirect a:hover {
          color: #3a7bd5;
          text-decoration: underline;
        }
        
        .lawyer-redirect {
          margin-top: 1rem;
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
        
        .fa-spin {
          animation: fa-spin 1s infinite linear;
        }
        
        @keyframes fa-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 968px) {
          .name-fields {
            grid-template-columns: 1fr 1fr;
          }
          
          .password-fields {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .user-signup-content {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
          
          .signup-intro {
            padding: 2rem;
            text-align: center;
          }
          
          .signup-form-wrapper {
            padding: 2rem;
          }
          
          .name-fields {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .user-signup-container {
            padding: 1rem;
          }
          
          .signup-intro, .signup-form-wrapper {
            padding: 1.5rem;
          }
          
          .signup-intro h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default UserSignup;