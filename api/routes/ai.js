import express from 'express';
import functionsService from '../services/functions-service.js';

const router = express.Router();

// POST - get code explanation (using AnalyzeCode function)
router.post('/explain', async (req, res) => {
  const { code, challengeTitle } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided for explanation' });
  }
  
  try {
    // Call the Azure Function to analyze the code for explanation
    const analysisResult = await functionsService.analyzeCode(code, 'explain', challengeTitle);
    
    // In case the function returned an error
    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: analysisResult.error || 'Failed to generate explanation'
      });
    }
    
    res.json({
      success: true,
      explanation: analysisResult.analysis.explanation
    });
  } catch (error) {
    console.error('Error generating code explanation:', error);
    res.status(500).json({ 
      error: 'Failed to generate explanation', 
      details: error.message 
    });
  }
});

// POST - suggest code improvements (using AnalyzeCode function)
router.post('/improve', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided for improvement suggestions' });
  }
  
  try {
    // Call the Azure Function to analyze the code for improvements
    const analysisResult = await functionsService.analyzeCode(code, 'improve');
    
    // In case the function returned an error
    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: analysisResult.error || 'Failed to generate improvement suggestions'
      });
    }
    
    res.json({
      success: true,
      suggestions: analysisResult.analysis.suggestions
    });
  } catch (error) {
    console.error('Error generating improvement suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate improvement suggestions', 
      details: error.message 
    });
  }
});

// POST - analyze code for bugs (using AnalyzeCode function)
router.post('/debug', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided for debugging' });
  }
  
  try {
    // Call the Azure Function to analyze the code for debugging
    const analysisResult = await functionsService.analyzeCode(code, 'debug');
    
    // In case the function returned an error
    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: analysisResult.error || 'Failed to debug code'
      });
    }
    
    res.json({
      success: true,
      issues: analysisResult.analysis.issues,
      hasErrors: analysisResult.analysis.hasErrors
    });
  } catch (error) {
    console.error('Error debugging code:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code for bugs', 
      details: error.message 
    });
  }
});

// POST - general code analysis (using AnalyzeCode function)
router.post('/analyze', async (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided for analysis' });
  }
  
  try {
    // Call the Azure Function for general code analysis
    const analysisResult = await functionsService.analyzeCode(code, 'general');
    
    // In case the function returned an error
    if (!analysisResult.success) {
      return res.status(400).json({
        success: false,
        error: analysisResult.error || 'Failed to analyze code'
      });
    }
    
    res.json({
      success: true,
      analysis: analysisResult.analysis
    });
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code', 
      details: error.message 
    });
  }
});

export default router;