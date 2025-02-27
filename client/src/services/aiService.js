import api from './api';

const aiService = {
  // Get AI explanation of code
  explainCode: async (code, challengeTitle = '') => {
    try {
      const response = await api.post('/ai/explain', { code, challengeTitle });
      return response.data;
    } catch (error) {
      console.error('Error getting code explanation:', error);
      throw error;
    }
  },

  // Get AI suggestions to improve code
  improveCode: async (code) => {
    try {
      const response = await api.post('/ai/improve', { code });
      return response.data;
    } catch (error) {
      console.error('Error getting code improvements:', error);
      throw error;
    }
  },

  // Get AI debugging assistance
  debugCode: async (code) => {
    try {
      const response = await api.post('/ai/debug', { code });
      return response.data;
    } catch (error) {
      console.error('Error debugging code:', error);
      throw error;
    }
  },

  // Get general code analysis
  analyzeCode: async (code) => {
    try {
      const response = await api.post('/ai/analyze', { code });
      return response.data;
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw error;
    }
  }
};

export default aiService;