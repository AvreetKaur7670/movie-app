import axios from 'axios';

const API_URL = 'http://4.237.58.241:3000';

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/register`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(`${API_URL}/user/refresh`, {
      refreshToken
    });
    
    // Update tokens
    localStorage.setItem('bearerToken', response.data.bearerToken.token);
    localStorage.setItem('tokenExpiry', Date.now() + (response.data.bearerToken.expires_in * 1000));
    
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const logout = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_URL}/user/logout`, {
      refreshToken
    });
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};