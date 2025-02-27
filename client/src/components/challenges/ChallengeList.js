import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import challengeService from '../../services/challengeService';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const data = await challengeService.getAllChallenges();
        setChallenges(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch challenges');
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Filter challenges based on difficulty and search term
  const filteredChallenges = challenges.filter(challenge => {
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             challenge.difficulty === selectedDifficulty;
    
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDifficulty && matchesSearch;
  });

  if (loading) return <div className="loading">Loading challenges...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="challenges-container">
      <h2>Coding Challenges</h2>
      <p>Select a challenge to start coding with AI assistance</p>
      
      <div className="filter-controls">
        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="difficulty-filter"
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        
        <input 
          type="text" 
          placeholder="Search challenges..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="challenge-list">
        {filteredChallenges.length === 0 ? (
          <p>No challenges match your criteria</p>
        ) : (
          filteredChallenges.map((challenge) => (
            <Link to={`/challenge/${challenge.id}`} key={challenge.id} className="challenge-card">
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <div className="challenge-meta">
                <span className={`difficulty ${challenge.difficulty}`}>
                  {challenge.difficulty}
                </span>
                {challenge.completionRate && (
                  <span className="completion-rate">
                    {challenge.completionRate}% completion rate
                  </span>
                )}
              </div>
              {challenge.tags && (
                <div className="challenge-tags">
                  {challenge.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChallengeList;