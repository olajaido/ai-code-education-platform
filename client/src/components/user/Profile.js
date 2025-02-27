import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      setProfile({
        username: "learner123",
        fullName: "Alex Johnson",
        email: "alex@example.com",
        joined: "January 2025",
        completedChallenges: 12,
        currentStreak: 5,
        skills: [
          { name: "JavaScript", level: 75 },
          { name: "Python", level: 45 },
          { name: "Algorithms", level: 60 },
          { name: "Data Structures", level: 50 }
        ],
        recentActivity: [
          { id: 1, type: "completed", challenge: "Hello World Function", date: "2 days ago" },
          { id: 2, type: "started", challenge: "FizzBuzz Challenge", date: "1 day ago" },
          { id: 3, type: "received_badge", badge: "JavaScript Beginner", date: "3 days ago" }
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Could not load profile</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.fullName.charAt(0)}
        </div>
        <div className="profile-info">
          <h2>{profile.fullName}</h2>
          <p>@{profile.username}</p>
          <p>Member since {profile.joined}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{profile.completedChallenges}</p>
          <p>challenges</p>
        </div>
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p className="stat-value">{profile.currentStreak}</p>
          <p>days</p>
        </div>
      </div>
      
      <div className="profile-skills">
        <h3>Skills Progress</h3>
        {profile.skills.map((skill, index) => (
          <div key={index} className="skill-progress">
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          {profile.recentActivity.map((activity) => (
            <li key={activity.id} className="activity-item">
              {activity.type === "completed" && (
                <span>Completed challenge: <strong>{activity.challenge}</strong></span>
              )}
              {activity.type === "started" && (
                <span>Started working on: <strong>{activity.challenge}</strong></span>
              )}
              {activity.type === "received_badge" && (
                <span>Earned badge: <strong>{activity.badge}</strong></span>
              )}
              <span className="activity-date">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;