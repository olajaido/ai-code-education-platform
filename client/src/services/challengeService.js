import api from './api';

const challengeService = {
  // Get all challenges
  getAllChallenges: async () => {
    try {
      const response = await api.get('/challenges');
      return response.data;
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  },

  // Get a specific challenge by ID
  getChallengeById: async (challengeId) => {
    try {
      const response = await api.get(`/challenges/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Submit a solution to a challenge
  submitSolution: async (challengeId, code) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/submit`, { code });
      return response.data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      throw error;
    }
  },

  // Get AI assistance for a challenge
  getAssistance: async (challengeId, code, prompt = '') => {
    try {
      const response = await api.post(`/challenges/${challengeId}/assist`, { 
        code, 
        prompt 
      });
      return response.data;
    } catch (error) {
      console.error('Error getting assistance:', error);
      throw error;
    }
  }
};

export default challengeService;