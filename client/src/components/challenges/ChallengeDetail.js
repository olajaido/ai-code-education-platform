import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../code-editor/Editor';
import challengeService from '../../services/challengeService';
import aiService from '../../services/aiService';

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const data = await challengeService.getChallengeById(id);
        setChallenge(data);
        setCode(data.starterCode);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching challenge:", err);
        setError("Failed to load challenge");
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    // Clear previous results when code changes
    setResult(null);
  };

  const handleSubmitCode = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const data = await challengeService.submitSolution(id, code);
      setResult(data);
      setIsSubmitting(false);
    } catch (err) {
      console.error("Error submitting code:", err);
      setError("Failed to submit code");
      setIsSubmitting(false);
    }
  };

  const handleRequestAiHint = async () => {
    try {
      setShowHint(false);
      const data = await challengeService.getAssistance(id, code);
      setAiHint(data.assistance);
      setShowHint(true);
    } catch (err) {
      console.error("Error getting AI hint:", err);
      setError("Failed to get AI hint");
    }
  };

  const handleExplainCode = async () => {
    try {
      const data = await aiService.explainCode(code, challenge?.title);
      setAiHint(data.explanation);
      setShowHint(true);
    } catch (err) {
      console.error("Error getting code explanation:", err);
      setError("Failed to explain code");
    }
  };

  if (loading) return <div className="loading">Loading challenge...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!challenge) return <div className="error">Challenge not found</div>;

  return (
    <div className="challenge-detail">
      <div className="challenge-header">
        <h2>{challenge.title}</h2>
        <span className={`difficulty ${challenge.difficulty}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <div className="challenge-description">
        <p>{challenge.description}</p>
      </div>
      
      <div className="challenge-instructions">
        <h3>Instructions:</h3>
        <ul>
          {challenge.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
      
      <div className="ai-assistance">
        <button onClick={handleRequestAiHint} className="ai-hint-button">
          Get AI Hint
        </button>
        <button onClick={handleExplainCode} className="ai-explain-button">
          Explain My Code
        </button>
        {showHint && (
          <div className="ai-hint">
            <h4>AI Assistant:</h4>
            <p>{aiHint}</p>
          </div>
        )}
      </div>
      
      <div className="code-editor-section">
        <h3>Your Solution:</h3>
        <CodeEditor 
          initialCode={code} 
          language="javascript" 
          onChange={handleCodeChange} 
        />
        <button 
          onClick={handleSubmitCode} 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </div>
      
      {result && (
        <div className={`result ${result.success ? 'success' : 'failure'}`}>
          <h3>Test Results:</h3>
          {result.message && <p className="result-message">{result.message}</p>}
          
          {result.results && (
            <ul className="test-results">
              {result.results.map((test, index) => (
                <li key={index} className={test.passed ? 'pass' : 'fail'}>
                  Test {index + 1}: {test.passed ? 'Passed' : 'Failed'}
                  {test.error && <div className="error-message">{test.error}</div>}
                  {test.input !== undefined && (
                    <div className="test-details">
                      Input: <code>{JSON.stringify(test.input)}</code><br />
                      Expected: <code>{JSON.stringify(test.expected)}</code><br />
                      {test.output !== undefined && (
                        <>Output: <code>{JSON.stringify(test.output)}</code></>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <div className="test-cases">
        <h3>Test Cases:</h3>
        <ul>
          {challenge.testCases.map((test, index) => (
            <li key={index}>
              Input: <code>{JSON.stringify(test.input)}</code>, 
              Expected: <code>{test.expected}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChallengeDetail;