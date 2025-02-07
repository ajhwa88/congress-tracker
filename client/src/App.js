import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CongressMemberList from './components/CongressMemberList/CongressMemberList';
import CongressMemberProfile from './components/CongressMemberProfile/CongressMemberProfile';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // We'll pass this down to both components
  const mockMembers = [
    {
      id: 1,
      name: "John Doe",
      state: "CA",
      party: "D",
      chamber: "Senate",
      twitterHandle: "@johndoe",
      profileImage: "https://via.placeholder.com/150",
      biography: "Serving since 2019. Member of the Finance Committee.",
      topIssues: ["Healthcare", "Climate Change", "Education"]
    },
    {
      id: 2,
      name: "Jane Smith",
      state: "NY",
      party: "R",
      chamber: "House",
      twitterHandle: "@janesmith",
      profileImage: "https://via.placeholder.com/150",
      biography: "Serving since 2020. Member of the Armed Services Committee.",
      topIssues: ["National Security", "Economy", "Immigration"]
    }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Congress Tracker</h1>
          <SearchBar members={mockMembers} onSearch={handleSearch} />
        </header>
        <main>
          <Routes>
            <Route 
              path="/" 
              element={<CongressMemberList searchTerm={searchTerm} members={mockMembers} />} 
            />
            <Route 
              path="/member/:id" 
              element={<CongressMemberProfile members={mockMembers} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
