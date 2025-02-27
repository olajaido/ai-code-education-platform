// import express from 'express';
// const router = express.Router();

// // GET all challenges
// router.get('/', (req, res) => {
//   // Mock data for now - will connect to database later
//   const challenges = [
//     {
//       id: 1,
//       title: 'Hello World Function',
//       description: 'Create a function that returns "Hello, World!"',
//       difficulty: 'beginner',
//       starterCode: 'function helloWorld() {\n  // Your code here\n}',
//       language: 'javascript'
//     },
//     {
//       id: 2,
//       title: 'FizzBuzz Challenge',
//       description: 'Print numbers from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz"',
//       difficulty: 'beginner',
//       starterCode: 'function fizzBuzz(n) {\n  // Your code here\n}',
//       language: 'javascript'
//     },
//     {
//       id: 3,
//       title: 'Array Manipulation',
//       description: 'Implement functions to filter and transform arrays',
//       difficulty: 'intermediate',
//       starterCode: 'function filterEven(arr) {\n  // Your code here\n}',
//       language: 'javascript'
//     }
//   ];
  
//   res.json(challenges);
// });

// // GET challenge by ID
// router.get('/:id', (req, res) => {
//   const id = parseInt(req.params.id);
  
//   // Mock data - in production would fetch from database
//   const challenge = {
//     id: id,
//     title: id === 1 ? 'Hello World Function' : `Challenge ${id}`,
//     description: 'Create a function that returns the famous greeting "Hello, World!" when called.',
//     difficulty: 'beginner',
//     instructions: [
//       'Define a function named helloWorld',
//       'The function should take no parameters',
//       'Return the string "Hello, World!"'
//     ],
//     starterCode: `function helloWorld() {\n  // Your code here\n\n}\n\n// Example usage:\n// console.log(helloWorld());`,
//     testCases: [
//       { input: [], expected: 'Hello, World!' }
//     ],
//     hints: [
//       'Remember that strings in JavaScript are enclosed in quotes',
//       'The return keyword is used to output a value from a function'
//     ]
//   };
  
//   res.json(challenge);
// });

// // POST - submit a solution
// router.post('/:id/submit', (req, res) => {
//   const { code } = req.body;
  
//   if (!code) {
//     return res.status(400).json({ error: 'No code submitted' });
//   }
  
//   // In production, this would run tests against the submitted code
//   // For now, return a mock result
//   res.json({
//     success: true,
//     results: [
//       { testCase: 1, passed: true, output: 'Hello, World!' }
//     ],
//     message: 'All tests passed!'
//   });
// });

// // POST - get AI assistance for a challenge
// router.post('/:id/assist', (req, res) => {
//   const { code, query } = req.body;
  
//   if (!code) {
//     return res.status(400).json({ error: 'No code provided' });
//   }
  
//   // In production, this would call Azure OpenAI service
//   // For now, return mock AI assistance
//   const aiResponse = query?.includes('error') 
//     ? "It looks like you might be missing a return statement in your function."
//     : "Try focusing on returning a string with the exact text 'Hello, World!'. Make sure your syntax is correct!";
  
//   res.json({
//     assistance: aiResponse
//   });
// });

// export default router;

import express from 'express';
import functionsService from '../services/functions-service.js';

const router = express.Router();

// GET all challenges
router.get('/', (req, res) => {
  // Mock data for now - will connect to database later
  const challenges = [
    {
      id: 1,
      title: 'Hello World Function',
      description: 'Create a function that returns "Hello, World!"',
      difficulty: 'beginner',
      starterCode: 'function helloWorld() {\n  // Your code here\n}',
      language: 'javascript'
    },
    {
      id: 2,
      title: 'FizzBuzz Challenge',
      description: 'Print numbers from 1 to n, replacing multiples of 3 with "Fizz", multiples of 5 with "Buzz"',
      difficulty: 'beginner',
      starterCode: 'function fizzBuzz(n) {\n  // Your code here\n}',
      language: 'javascript'
    },
    {
      id: 3,
      title: 'Array Manipulation',
      description: 'Implement functions to filter and transform arrays',
      difficulty: 'intermediate',
      starterCode: 'function filterEven(arr) {\n  // Your code here\n}',
      language: 'javascript'
    }
  ];
  
  res.json(challenges);
});

// GET challenge by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Mock data - in production would fetch from database
  const challenge = {
    id: id,
    title: id === 1 ? 'Hello World Function' : `Challenge ${id}`,
    description: 'Create a function that returns the famous greeting "Hello, World!" when called.',
    difficulty: 'beginner',
    instructions: [
      'Define a function named helloWorld',
      'The function should take no parameters',
      'Return the string "Hello, World!"'
    ],
    starterCode: `function helloWorld() {\n  // Your code here\n\n}\n\n// Example usage:\n// console.log(helloWorld());`,
    testCases: [
      { input: [], expected: 'Hello, World!' }
    ],
    hints: [
      'Remember that strings in JavaScript are enclosed in quotes',
      'The return keyword is used to output a value from a function'
    ]
  };
  
  res.json(challenge);
});

// POST - submit a solution (using ExecuteCode function)
router.post('/:id/submit', async (req, res) => {
  const { code } = req.body;
  const challengeId = parseInt(req.params.id);
  
  if (!code) {
    return res.status(400).json({ error: 'No code submitted' });
  }
  
  try {
    // Mock test cases based on the challenge ID
    let testCases = [];
    
    if (challengeId === 1) {
      testCases = [{ input: [], expected: 'Hello, World!' }];
    } else if (challengeId === 2) {
      testCases = [
        { input: 5, expected: '1\n2\nFizz\n4\nBuzz' },
        { input: 15, expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }
      ];
    } else if (challengeId === 3) {
      testCases = [{ input: [1, 2, 3, 4, 5, 6], expected: [2, 4, 6] }];
    } else {
      testCases = [{ input: [], expected: null }];
    }
    
    // Call the Azure Function to execute the code
    const executionResult = await functionsService.executeCode(code, 'javascript', testCases);
    
    // Update user's progress (in production, would save to database)
    // const progressUpdate = { userId: req.user.id, challengeId, completed: executionResult.success };
    
    res.json({
      success: executionResult.success,
      results: executionResult.results,
      message: executionResult.success ? 'All tests passed! Great job!' : 'Some tests failed. Keep trying!'
    });
  } catch (error) {
    console.error('Error in challenge submission:', error);
    res.status(500).json({ 
      error: 'Failed to execute code', 
      details: error.message 
    });
  }
});

// POST - get AI assistance for a challenge (using GenerateHint function)
router.post('/:id/assist', async (req, res) => {
  const { code, prompt } = req.body;
  const challengeId = req.params.id;
  
  if (!code && !prompt) {
    return res.status(400).json({ 
      error: 'Please provide code or a specific question for assistance' 
    });
  }
  
  try {
    // Determine challenge difficulty based on ID (in production, fetch from DB)
    let difficulty = 'beginner';
    if (parseInt(challengeId) > 2) {
      difficulty = 'intermediate';
    }
    
    // Call the Azure Function to generate a hint
    const hintResult = await functionsService.generateHint(code, challengeId, difficulty, prompt);
    
    res.json({
      success: hintResult.success,
      assistance: hintResult.hint,
      challengeId: hintResult.challengeId
    });
  } catch (error) {
    console.error('Error generating assistance:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI assistance', 
      details: error.message 
    });
  }
});

export default router;