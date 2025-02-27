import api from './api';

const progressService = {
  // Get user's overall progress
  getProgress: async () => {
    try {
      const response = await api.get('/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  },

  // Get progress for a specific challenge
  getChallengeProgress: async (challengeId) => {
    try {
      const response = await api.get(`/progress/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress for challenge ${challengeId}:`, error);
      throw error;
    }
  },

  // Update progress for a challenge
  updateProgress: async (challengeId, completed, code) => {
    try {
      const response = await api.post(`/progress/${challengeId}`, {
        completed,
        code
      });
      return response.data;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
};

export default progressService;