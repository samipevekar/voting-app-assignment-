import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionId');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username) => api.post('/auth/login', { username }),
  getProfile: () => api.get('/auth/profile')
};

export const voteAPI = {
  castVote: (option) => api.post('/votes/cast', { option }),
  getResults: () => api.get('/results')
};

export default api;