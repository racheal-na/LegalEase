import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const FutureWork = () => {
  const navigate = useNavigate();
  const upcomingFeatures = [
    {
      title: "Case Editing",
      description: "Ability to edit case details after creation, update documents, and modify case information as the legal process evolves.",
      icon: "fas fa-edit",
      status: "planned",
      priority: "high"
    },
    {
      title: "Appointment Management",
      description: "Comprehensive calendar system for scheduling, rescheduling, and managing appointments with automated reminders.",
      icon: "fas fa-calendar-alt",
      status: "planned",
      priority: "medium"
    },
    {
      title: "Messaging System",
      description: "Secure in-app messaging between clients and lawyers with file sharing capabilities and message history.",
      icon: "fas fa-comments",
      status: "planned",
      priority: "high"
    },
    {
      title: "Case Status Tracking",
      description: "Visual timeline to track case progress with notifications for important milestones and deadlines.",
      icon: "fas fa-tasks",
      status: "planned",
      priority: "medium"
    }
  ];

  const FeatureCard = ({ feature, index }) => {
    return (
      <motion.div 
        className={`feature-card ${feature.status} priority-${feature.priority}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '5px',
          height: '100%',
          background: feature.priority === 'high' ? '#e74c3c' : 
                    feature.priority === 'medium' ? '#f39c12' : '#2ecc71'
        }}></div>
        
        <div className="feature-icon" style={{
          fontSize: '2rem',
          color: '#4a6580',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <i className={feature.icon}></i>
          <span className="priority-badge" style={{
            fontSize: '0.7rem',
            padding: '0.3rem 0.6rem',
            borderRadius: '20px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            background: feature.priority === 'high' ? '#ffebee' : 
                      feature.priority === 'medium' ? '#fff8e1' : '#e8f5e9',
            color: feature.priority === 'high' ? '#e74c3c' : 
                  feature.priority === 'medium' ? '#f39c12' : '#2ecc71'
          }}>{feature.priority}</span>
        </div>
        
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '0.8rem',
          color: '#2c3e50'
        }}>{feature.title}</h3>
        
        <p style={{
          color: '#7b8a9b',
          lineHeight: '1.5',
          marginBottom: '1.5rem'
        }}>{feature.description}</p>
        
        <div className="status-indicator" style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.85rem',
          color: '#7b8a9b'
        }}>
          <span className={`status-dot ${feature.status}`} style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            marginRight: '0.5rem',
            background: feature.status === 'planned' ? '#7b8a9b' : '#3498db'
          }}></span>
          {feature.status.replace('-', ' ')}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="future-work-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#2c3e50'
    }}>

      <motion.button
        onClick={() => navigate('/userPage')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #4a6580 0%, #2c3e50 100%)',
          color: 'white',
          border: 'none',
          padding: '0.8rem 1.5rem',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          transition: 'all 0.3s ease'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-arrow-left"></i>
        Back to Dashboard
      </motion.button>

      <div className="future-work-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #4a6580 0%, #2c3e50 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px'
      }}>
        <div className="header-content">
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>Coming Soon</h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: '0.9',
            maxWidth: '600px'
          }}>We're constantly working to improve your legal consultation experience. Here's what we're planning to add next.</p>
        </div>
        <div className="header-graphic" style={{
          fontSize: '4rem',
          opacity: '0.7'
        }}>
          <i className="fas fa-rocket"></i>
        </div>
      </div>

      <div className="features-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {upcomingFeatures.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="roadmap-section" style={{ marginBottom: '3rem' }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#2c3e50'
        }}>Development Roadmap</h2>
        
        <div className="roadmap-timeline" style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            height: '3px',
            background: '#e9ecef',
            zIndex: 1
          }}></div>
          
          <div className="roadmap-phase" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            width: '30%',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="phase-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: '#2c3e50',
                margin: 0
              }}>Phase 1: Core Enhancements</h3>
              <span className="phase-date" style={{
                fontSize: '0.85rem',
                color: '#7b8a9b',
                background: '#f8f9fa',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px'
              }}>Q3 2023</span>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Case Editing</li>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Basic Messaging</li>
            </ul>
          </div>
          
          <div className="roadmap-phase" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            width: '30%',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="phase-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: '#2c3e50',
                margin: 0
              }}>Phase 2: Communication Tools</h3>
              <span className="phase-date" style={{
                fontSize: '0.85rem',
                color: '#7b8a9b',
                background: '#f8f9fa',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px'
              }}>Q4 2023</span>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Appointment Management</li>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Advanced Messaging System</li>
            </ul>
          </div>
          
          <div className="roadmap-phase" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            width: '30%',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="phase-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: '#2c3e50',
                margin: 0
              }}>Phase 3: Advanced Features</h3>
              <span className="phase-date" style={{
                fontSize: '0.85rem',
                color: '#7b8a9b',
                background: '#f8f9fa',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px'
              }}>Q1 2024</span>
            </div>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Payment Integration</li>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Video Consultations</li>
              <li style={{
                padding: '0.5rem 0',
                color: '#4a6580',
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>Case Status Tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="feedback-section" style={{
        textAlign: 'center',
        background: '#f8f9fa',
        padding: '2rem',
        borderRadius: '12px'
      }}>
        <h2 style={{
          marginBottom: '0.5rem',
          color: '#2c3e50'
        }}>Have Suggestions?</h2>
        <p style={{
          color: '#7b8a9b',
          marginBottom: '1.5rem'
        }}>We'd love to hear your ideas for improving our platform.</p>
        <button className="feedback-button" style={{
          background: 'linear-gradient(135deg, #4a6580 0%, #2c3e50 100%)',
          color: 'white',
          border: 'none',
          padding: '0.8rem 1.5rem',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s ease'
        }}>
          <i className="fas fa-comment-dots"></i>
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FutureWork;