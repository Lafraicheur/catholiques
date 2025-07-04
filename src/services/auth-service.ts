import axios from 'axios';

const API_URL = 'https://api.cathoconnect.ci/api:35Re9Rls';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/admin/auth/login`, {
      email,
      password,
      type: 'email'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdminProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/admin/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (token: string) => {
  try {
    await axios.get(`${API_URL}/user/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Supprimer le token du localStorage
    localStorage.removeItem('auth_token');
  } catch (error) {
    // Même en cas d'erreur, on supprime le token local
    localStorage.removeItem('auth_token');
    throw error;
  }
};