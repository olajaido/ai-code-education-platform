import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// In development, functions will be on localhost
// In production, this would be your Azure Function App URL
const FUNCTIONS_BASE_URL = process.env.FUNCTIONS_URL || 'http://localhost:7071/api';

class FunctionsService {
  /**
   * Execute code through the Azure Function
   */
  async executeCode(code, language = 'javascript', testCases = []) {
    try {
      const response = await axios.post(`${FUNCTIONS_BASE_URL}/ExecuteCode`, {
        code,
        language,
        testCases
      });
      return response.data;
    } catch (error) {
      console.error('Error executing code:', error.message);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Code execution failed');
    }
  }

  /**
   * Analyze code using AI
   */
  async analyzeCode(code, type = 'general', challengeTitle = '') {
    try {
      const response = await axios.post(`${FUNCTIONS_BASE_URL}/AnalyzeCode`, {
        code,
        type,
        challengeTitle
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing code:', error.message);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Code analysis failed');
    }
  }

  /**
   * Generate hints for the user
   */
  async generateHint(code, challengeId, difficulty, prompt = '') {
    try {
      const response = await axios.post(`${FUNCTIONS_BASE_URL}/GenerateHint`, {
        code,
        challengeId,
        difficulty,
        prompt
      });
      return response.data;
    } catch (error) {
      console.error('Error generating hint:', error.message);
      if (error.response) {
        return error.response.data;
      }
      throw new Error('Hint generation failed');
    }
  }
}

export default new FunctionsService();