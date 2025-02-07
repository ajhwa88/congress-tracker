import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { congressApi } from '../../services/congressApi';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const data = await congressApi.getAllMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getFilteredMembers = () => {
    if (!searchTerm) return [];
    
    const searchTermLower = searchTerm.toLowerCase();
    const searchTerms = searchTermLower.split(' ').filter(term => term.length > 0);
    
    return members.filter(member => {
      // Get normalized versions of the name
      const fullName = member.name.toLowerCase();
      const nameParts = fullName.split(/[,.\s]+/).filter(part => part.length > 0);
      
      // For each search term, check if it matches the start of any name part
      return searchTerms.every(term => {
        return nameParts.some(part => {
          // Check for exact match
          if (part === term) return true;
          // Check for start of word match
          if (part.startsWith(term)) return true;
          // Check for partial match within the name
          if (fullName.includes(term)) return true;
          return false;
        });
      });
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (member) => {
    setSearchTerm(member.name);
    setShowSuggestions(false);
    navigate(`/member/${member.id}`);
  };

  const filteredMembers = getFilteredMembers();

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by name (e.g., 'Ro' or 'Khanna' or 'Ro Khanna')"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(searchTerm.length > 0)}
        className="search-input"
      />
      {showSuggestions && searchTerm.length > 0 && (
        <div className="suggestions-container">
          {loading ? (
            <div className="suggestion-item">Loading...</div>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.slice(0, 10).map(member => (
              <div
                key={member.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(member)}
              >
                <div className="suggestion-info">
                  <div className="suggestion-name">{member.name}</div>
                  <div className="suggestion-details">
                    {member.party} - {member.state}, {member.chamber}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-suggestions">
              No members found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 