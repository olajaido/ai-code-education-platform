import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ initialCode = '', language = 'javascript', onChange }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const handleCodeChange = (value) => {
    setCode(value);
    // Call the onChange prop if provided
    if (onChange) {
      onChange(value);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      // In production, you would call the Azure Function
      // For now, we'll use a simple evaluation for demonstration
      const result = eval(code);
      setOutput(String(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-container">
      <Editor
        height="400px"
        defaultLanguage={language}
        defaultValue={initialCode}
        onChange={handleCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          automaticLayout: true,
        }}
      />
      
      <div className="editor-controls">
        <button 
          className="run-button"
          onClick={runCode}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div className="output-container">
        <h3>Output:</h3>
        {error ? (
          <div className="error-output">{error}</div>
        ) : (
          <pre className="code-output">{output}</pre>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;