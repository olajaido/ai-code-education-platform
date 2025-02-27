import express from 'express';
const router = express.Router();

// POST - user login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // In production, would validate against database
  // Mock successful login
  res.json({
    success: true,
    user: {
      id: 1,
      name: 'Alex Johnson',
      email: email,
      token: 'mock-jwt-token'
    }
  });
});

// POST - user registration
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }
  
  // In production, would save to database
  // Mock successful registration
  res.json({
    success: true,
    user: {
      id: 1,
      name: name,
      email: email,
      token: 'mock-jwt-token'
    }
  });
});

// GET - user profile
router.get('/profile', (req, res) => {
  // In production, would extract user ID from JWT token
  
  // Mock profile data
  res.json({
    id: 1,
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
});

export default router;