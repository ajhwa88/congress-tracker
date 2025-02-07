import React from 'react';

const CongressMemberList = () => {
  return (
    <div className="congress-member-list">
      <div className="welcome-section">
        <h2>Welcome to Congress Tracker</h2>
        <p>Search above for any member of Congress to:</p>
        <ul className="feature-list">
          <li>View their voting record</li>
          <li>Compare votes with public statements</li>
          <li>Track their social media activity</li>
          <li>Access their congressional information</li>
        </ul>
      </div>
    </div>
  );
};

export default CongressMemberList;
