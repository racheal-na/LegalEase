import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { Link } from 'react-router';

const DisplayAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchAvailabilities();
  }, [selectedDate, showAll]);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/availableDate/getAvailableDate`, 
        {
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        const filteredAvailabilities = showAll 
          ? response.data 
          : response.data.filter(avail => {
              const availDate = new Date(avail.availableDate);
              return availDate.toDateString() === selectedDate.toDateString();
            });
        
        setAvailabilities(filteredAvailabilities);
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const formatDateDisplay = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return 'Today';
      if (isTomorrow(date)) return 'Tomorrow';
      return format(date, 'EEE, MMM d');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const deleteAvailability = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/availability/${id}`, {
        withCredentials: true
      });
      
      if (response.status === 200) {
        setAvailabilities(prev => prev.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      setError('Failed to delete availability');
    }
  };

  const groupByDate = () => {
    const grouped = {};
    
    availabilities.forEach(availability => {
      try {
        const dateStr = availability.availableDate.split('T')[0];
        
        if (!grouped[dateStr]) {
          grouped[dateStr] = [];
        }
        
        grouped[dateStr].push(availability);
      } catch (error) {
        console.error('Error grouping availability:', error);
      }
    });
    
    return grouped;
  };

  const groupedAvailabilities = groupByDate();

  const handleShowAllToggle = () => {
    setShowAll(!showAll);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
    setShowAll(false);
  };

  if (loading) {
    return <LoadingAvailability />;
  }

  return (
    <div className="availability-container">
      <div className="navigation-buttons">
        <Link to={'/lawyerPage'}>
          <button className="btn-back">
            <i className="fas fa-arrow-left"></i>
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="availability-header">
        <div className="header-content">
          <h2>Your Availability Schedule</h2>
          <p>Manage your available time slots for client appointments</p>
        </div>
        <Link to={'/createAvailability'}>
          <button className="btn-primary">
            <i className="fas fa-plus"></i>
            Add Time Slot
          </button>
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="controls-section">
        <div className="date-filter">
          <div className="filter-header">
            <i className="fas fa-filter"></i>
            <span>Filter Options</span>
          </div>
          <div className="filter-controls">
            <div className="date-input-group">
              <label htmlFor="date-picker">Select Date:</label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                disabled={showAll}
              />
            </div>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showAll}
                  onChange={handleShowAllToggle}
                />
                <span className="toggle-slider"></span>
                Show All Dates
              </label>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-number">{availabilities.length}</div>
            <div className="stat-label">Total Slots</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{Object.keys(groupedAvailabilities).length}</div>
            <div className="stat-label">Days with Availability</div>
          </div>
        </div>
      </div>

      {availabilities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-calendar-plus"></i>
          </div>
          <h3>No availability set {!showAll ? 'for this date' : ''}</h3>
          <p>Add your available time slots to start receiving appointments</p>
          <Link to={'/createAvailability'}>
            <button className="btn-primary">
              <i className="fas fa-plus"></i>
              Create Your First Availability
            </button>
          </Link>
        </div>
      ) : (
        <div className="schedule-container">
          <div className="schedule-header">
            <h3>Your Availability Schedule</h3>
            <div className="time-legend">
              <div className="legend-item">
                <div className="color-box morning"></div>
                <span>Morning (6AM-12PM)</span>
              </div>
              <div className="legend-item">
                <div className="color-box afternoon"></div>
                <span>Afternoon (12PM-5PM)</span>
              </div>
              <div className="legend-item">
                <div className="color-box evening"></div>
                <span>Evening (5PM+)</span>
              </div>
            </div>
          </div>
          
          <div className="schedule-grid">
            {Object.entries(groupedAvailabilities).map(([date, dateAvailabilities]) => (
              <div key={date} className="schedule-day-card">
                <div className="day-header">
                  <h4>{formatDateDisplay(date)}</h4>
                  <div className="slots-count">{dateAvailabilities.length} slot(s)</div>
                </div>
                
                <div className="time-slots-container">
                  {dateAvailabilities.map(availability => (
                    <TimeSlot 
                      key={availability._id} 
                      availability={availability} 
                      onDelete={deleteAvailability}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .availability-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .navigation-buttons {
          margin-bottom: 1.5rem;
        }

        .btn-back {
          background: none;
          border: 1px solid #d1d5db;
          color: #4a6580;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .btn-back:hover {
          background-color: #f1f5f9;
          border-color: #9ca3af;
        }

        .availability-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header-content h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .header-content p {
          color: #64748b;
          margin: 0;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4a6580 0%, #2c3e50 100%);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .controls-section {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .date-filter {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #4a6580;
          font-weight: 600;
        }

        .filter-controls {
          display: flex;
          gap: 1.5rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-input-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .date-input-group input {
          padding: 0.6rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          background: white;
        }

        .date-input-group input:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
        }

        .toggle-group {
          display: flex;
          align-items: center;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
          position: relative;
        }

        .toggle-label input {
          opacity: 0;
          position: absolute;
        }

        .toggle-slider {
          width: 42px;
          height: 22px;
          background-color: #d1d5db;
          border-radius: 34px;
          position: relative;
          transition: background-color 0.3s;
        }

        .toggle-slider:before {
          content: "";
          position: absolute;
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: transform 0.3s;
          border-radius: 50%;
        }

        .toggle-label input:checked + .toggle-slider {
          background-color: #4a6580;
        }

        .toggle-label input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .stats-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 2rem;
          min-width: 250px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .schedule-container {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .schedule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .schedule-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.3rem;
        }

        .time-legend {
          display: flex;
          gap: 1.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .color-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .color-box.morning {
          background-color: #4a6580;
        }

        .color-box.afternoon {
          background-color: #2e7d32;
        }

        .color-box.evening {
          background-color: #6a1b9a;
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .schedule-day-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 1.25rem;
          border: 1px solid #e2e8f0;
        }

        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .day-header h4 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .slots-count {
          background: #e2e8f0;
          color: #475569;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .time-slots-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          color: #64748b;
        }

        .empty-icon {
          font-size: 4rem;
          color: #e2e8f0;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 0.5rem;
          color: #4a6580;
          font-size: 1.5rem;
        }

        .empty-state p {
          margin-bottom: 2rem;
          font-size: 1rem;
        }

        .error-message {
          background-color: #fef2f2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border-left: 4px solid #dc2626;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #64748b;
        }

        .loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4a6580;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .controls-section {
            grid-template-columns: 1fr;
          }
          
          .stats-card {
            justify-content: space-around;
          }
        }

        @media (max-width: 768px) {
          .availability-container {
            padding: 1rem;
          }
          
          .availability-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .filter-controls {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .schedule-grid {
            grid-template-columns: 1fr;
          }
          
          .schedule-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .time-legend {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .stats-card {
            flex-direction: column;
            gap: 1rem;
            min-width: auto;
          }
        }
      `}</style>
      
      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

const TimeSlot = ({ availability, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      setIsDeleting(true);
      await onDelete(availability._id);
      setIsDeleting(false);
    }
  };

  const getColorForTime = (startTime) => {
    try {
      const hour = parseInt(startTime.split(':')[0]);

      if (hour >= 6 && hour < 12) {
        return '#4a6580';
      } else if (hour >= 12 && hour < 17) {
        return '#2e7d32';
      } else {
        return '#6a1b9a';
      }
    } catch (error) {
      return '#4a6580';
    }
  };

  const timeColor = getColorForTime(availability.startTime);
  const timePeriod = timeColor === '#4a6580' ? 'morning' : timeColor === '#2e7d32' ? 'afternoon' : 'evening';

  return (
    <div className="time-slot-card" style={{ borderLeft: `3px solid ${timeColor}` }}>
      <div className="time-slot-content">
        <div className="time-display">
          <div className="time-range">
            <i className="fas fa-clock" style={{ color: timeColor }}></i>
            <span className="time-text">{availability.startTime} - {availability.endTime}</span>
          </div>
          <div className="time-duration">
            {calculateDuration(availability.startTime, availability.endTime)}
          </div>
        </div>
        
        <div className="time-meta">
          <div className="time-period-badge">
            <span className={`period-dot ${timePeriod}`}></span>
            {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}
          </div>
          <button 
            className="delete-time-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete time slot"
          >
            {isDeleting ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-trash-alt"></i>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .time-slot-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .time-slot-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .time-slot-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .time-display {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .time-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .time-text {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1rem;
        }

        .time-duration {
          font-size: 0.85rem;
          color: #64748b;
          margin-left: 1.6rem;
        }

        .time-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .time-period-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
        }

        .period-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .period-dot.morning {
          background-color: #4a6580;
        }

        .period-dot.afternoon {
          background-color: #2e7d32;
        }

        .period-dot.evening {
          background-color: #6a1b9a;
        }

        .delete-time-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-time-btn:hover {
          color: #dc2626;
          background-color: #fef2f2;
        }

        .delete-time-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .time-slot-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .time-meta {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

const LoadingAvailability = () => {
  return (
    <div className="availability-container">
      <div className="navigation-buttons">
        <button className="btn-back" disabled>
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="availability-header">
        <div className="header-content">
          <h2>Your Availability Schedule</h2>
          <p>Manage your available time slots for client appointments</p>
        </div>
        <button className="btn-primary" disabled>
          <i className="fas fa-plus"></i>
          Add Time Slot
        </button>
      </div>

      <div className="controls-section">
        <div className="date-filter">
          <div className="filter-header">
            <i className="fas fa-filter"></i>
            <span>Filter Options</span>
          </div>
          <div className="filter-controls">
            <div className="date-input-group">
              <label htmlFor="date-picker">Select Date:</label>
              <input
                id="date-picker"
                type="date"
                disabled
              />
            </div>
            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  disabled
                />
                <span className="toggle-slider"></span>
                Show All Dates
              </label>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-number">-</div>
            <div className="stat-label">Total Slots</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">-</div>
            <div className="stat-label">Days with Availability</div>
          </div>
        </div>
      </div>

      <div className="loading">
        <div className="spinner"></div>
        <h3>Loading Your Availability...</h3>
        <p>Please wait while we fetch your schedule information</p>
      </div>

      <style jsx>{`
        .availability-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        .navigation-buttons {
          margin-bottom: 1.5rem;
        }

        .btn-back {
          background: none;
          border: 1px solid #d1d5db;
          color: #9ca3af;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          opacity: 0.7;
        }

        .availability-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .header-content h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin: 0 0 0.5rem 0;
          font-weight: 700;
        }

        .header-content p {
          color: #64748b;
          margin: 0;
          font-size: 1rem;
        }

        .btn-primary {
          background: #e2e8f0;
          color: #9ca3af;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          opacity: 0.7;
          cursor: not-allowed;
        }

        .controls-section {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .date-filter {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #9ca3af;
          font-weight: 600;
        }

        .filter-controls {
          display: flex;
          gap: 1.5rem;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .date-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-input-group label {
          font-weight: 500;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .date-input-group input {
          padding: 0.6rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          background: #f8fafc;
          color: #9ca3af;
        }

        .toggle-group {
          display: flex;
          align-items: center;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          color: #9ca3af;
          position: relative;
        }

        .toggle-slider {
          width: 42px;
          height: 22px;
          background-color: #e2e8f0;
          border-radius: 34px;
          position: relative;
        }

        .stats-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 2rem;
          min-width: 250px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #9ca3af;
          font-weight: 500;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #64748b;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .loading .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4a6580;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .loading h3 {
          color: #4a6580;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .loading p {
          color: #64748b;
          font-size: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .controls-section {
            grid-template-columns: 1fr;
          }
          
          .stats-card {
            justify-content: space-around;
          }
        }

        @media (max-width: 768px) {
          .availability-container {
            padding: 1rem;
          }
          
          .availability-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .filter-controls {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .stats-card {
            flex-direction: column;
            gap: 1rem;
            min-width: auto;
          }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

const calculateDuration = (startTime, endTime) => {
  try {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let hours = endHour - startHour;
    let minutes = endMinute - startMinute;
    
    if (minutes < 0) {
      hours -= 1;
      minutes += 60;
    }
    
    if (hours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${minutes} min`;
    }
  } catch (error) {
    return "Duration N/A";
  }
};

export default DisplayAvailability;