import express from 'express';
const router = express.Router();

// GET - user progress overview
router.get('/', (req, res) => {
  // In production, would extract user ID from JWT token & fetch from database
  
  // Mock progress data
  res.json({
    completedChallenges: 12,
    totalChallenges: 30,
    currentStreak: 5,
    longestStreak: 8,
    skillBreakdown: [
      { category: "JavaScript", completed: 8, total: 15 },
      { category: "Python", completed: 3, total: 10 },
      { category: "Algorithms", completed: 1, total: 5 }
    ],
    recentChallenges: [
      { id: 1, title: "Hello World", completedAt: "2025-02-24T15:30:00Z", score: 100 },
      { id: 2, title: "FizzBuzz", completedAt: "2025-02-23T11:45:00Z", score: 90 },
      { id: 3, title: "Array Filter", completedAt: "2025-02-20T09:15:00Z", score: 85 }
    ]
  });
});

// POST - update challenge progress
router.post('/:challengeId', (req, res) => {
  const { challengeId } = req.params;
  const { completed, code } = req.body;
  
  if (completed === undefined) {
    return res.status(400).json({ error: 'Completed status is required' });
  }
  
  // In production, would save to database
  // Mock successful update
  res.json({
    success: true,
    challengeId: parseInt(challengeId),
    completed: completed,
    updatedAt: new Date().toISOString()
  });
});

// GET - progress for a specific challenge
router.get('/:challengeId', (req, res) => {
  const { challengeId } = req.params;
  
  // Mock challenge progress
  res.json({
    challengeId: parseInt(challengeId),
    attempts: 3,
    completed: true,
    bestScore: 95,
    lastAttempt: {
      timestamp: new Date().toISOString(),
      code: "function helloWorld() {\n  return 'Hello, World!';\n}",
      result: "Success"
    }
  });
});

export default router;