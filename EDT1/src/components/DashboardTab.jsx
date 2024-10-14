import React from 'react';

const DashboardTab = ({ id, isActive, onClick, onClose }) => {
  return (
    <div
      className={`dashboard-tab ${isActive ? 'active-tab' : ''}`}
      onClick={onClick}
    >
      Dashboard {id}
      <span className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        &times;
      </span>
    </div>
  );
};

export default DashboardTab;