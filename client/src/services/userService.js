import api from './api';

const userService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      
      // Store the token in localStorage for future authenticated requests
      if (response.data.user && response.data.user.token) {
        localStorage.setItem('token', response.data.user.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register
  register: async (name, email, password) => {
    try {
      const response = await api.post('/users/register', { name, email, password });
      
      // Store the token in localStorage for future authenticated requests
      if (response.data.user && response.data.user.token) {
        localStorage.setItem('token', response.data.user.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  }
};

export default userService;