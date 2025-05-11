import axios from 'axios';
import { refreshToken } from './auth';

const API_URL = 'http://4.237.58.241:3000';

// Create a base API instance
export const api = axios.create({
  baseURL: API_URL
});

// Create an authenticated API instance with interceptors
export const createAuthApi = () => {
  const authApi = axios.create({
    baseURL: API_URL
  });
  
  // Add request interceptor to handle token expiry
  authApi.interceptors.request.use(async (config) => {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const bearerToken = localStorage.getItem('bearerToken');
    
    // If token is expired or will expire in the next minute
    if (tokenExpiry && Date.now() > (parseInt(tokenExpiry) - 60000)) {
      try {
        // Try to refresh the token
        await refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    
    // Add the token to the request
    if (bearerToken) {
      config.headers.Authorization = `Bearer ${bearerToken}`;
    }
    
    return config;
  });
  
  return authApi;
};

// Movie API endpoints
export const fetchMovies = async (title = '', year = '', page = 1) => {
  try {
    const response = await api.get('/movies/search', {
      params: { title, year, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (imdbID) => {
  try {
    const response = await api.get(`/movies/data/${imdbID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const fetchPersonDetails = async (id) => {
  try {
    const authApi = createAuthApi();
    const response = await authApi.get(`/people/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw error;
  }
};
