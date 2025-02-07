import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { congressApi } from '../../services/congressApi';
import './CongressMemberProfile.css';

const CongressMemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await congressApi.getMemberDetails(id);
        console.log('Member Data:', memberData);
        setMember(memberData);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('Failed to load member information');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!member) return <div className="error">Member not found</div>;

  return (
    <div className="member-profile">
      <Link to="/" className="back-link">← Back to Members</Link>
      
      <div className="profile-header">
        {member.profileImage && (
          <img 
            src={member.profileImage} 
            alt={member.name}
            className="profile-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="profile-info">
          <h1>{member.name}</h1>
          <div className="member-details">
            <p><strong>State:</strong> {member.state}</p>
            <p><strong>Party:</strong> {member.party}</p>
            <p><strong>Chamber:</strong> {member.chamber}</p>
            {member.district && (
              <p><strong>District:</strong> {member.district}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CongressMemberProfile; 