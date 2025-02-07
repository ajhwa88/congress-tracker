import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { congressApi } from '../../services/congressApi';

const CongressMemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const [memberData, votingData] = await Promise.all([
          congressApi.getMemberDetails(id),
          congressApi.getMemberVotes(id)
        ]);
        
        setMember(memberData);
        setVotes(votingData);
      } catch (err) {
        setError('Failed to load member data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading member data...</div>;
  }

  if (error || !member) {
    return <div className="error">{error || 'Member not found'}</div>;
  }

  return (
    <div className="member-profile">
      <Link to="/" className="back-button">← Back to Search</Link>
      
      <div className="profile-header">
        <img 
          src={member.profileImage} 
          alt={member.name} 
          className="profile-large-image"
        />
        <div className="profile-header-info">
          <h1>{member.name}</h1>
          <div className="profile-basic-info">
            <span className="info-badge">{member.party}</span>
            <span className="info-badge">{member.state}</span>
            <span className="info-badge">{member.chamber}</span>
            {member.district && (
              <span className="info-badge">District {member.district}</span>
            )}
          </div>
          {member.phoneNumber && (
            <p className="contact-info">
              <strong>Office Phone:</strong> {member.phoneNumber}
            </p>
          )}
          {member.twitterHandle && member.twitterHandle !== 'N/A' && (
            <a 
              href={`https://twitter.com/${member.twitterHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="twitter-link"
            >
              {member.twitterHandle}
            </a>
          )}
        </div>
      </div>

      <div className="profile-content">
        <section className="profile-section">
          <h2>Recent Sponsored Bills</h2>
          {member.sponsoredBills?.length > 0 ? (
            <ul className="bills-list">
              {member.sponsoredBills.slice(0, 5).map((bill, index) => (
                <li key={index} className="bill-item">
                  <h4>{bill.title}</h4>
                  <p className="bill-info">
                    <span>Bill Number: {bill.number}</span>
                    <span>Introduced: {new Date(bill.introducedDate).toLocaleDateString()}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent bills found</p>
          )}
        </section>

        <section className="profile-section">
          <h2>Recent Votes</h2>
          {votes?.length > 0 ? (
            <ul className="votes-list">
              {votes.slice(0, 5).map((vote, index) => (
                <li key={index} className="vote-item">
                  <h4>{vote.description}</h4>
                  <p className="vote-info">
                    <span className={`vote-position ${vote.position?.toLowerCase()}`}>
                      Vote: {vote.position}
                    </span>
                    <span>Date: {new Date(vote.date).toLocaleDateString()}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent votes found</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default CongressMemberProfile; 