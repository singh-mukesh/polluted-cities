import axios from 'axios';
import config from '../config/env.js';

export async function loginAndGetToken() {
  const { API_URL, API_USER, API_PASS } = config;
  try {
    const res = await axios.post(
      `${API_URL}/auth/login`,
      {
        username: API_USER,
        password: API_PASS,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    // The API should return a token (e.g., JWT)
    const token = res.data.token; // Adjust if the key is different
    return token;
  } catch (error) {
    console.error('Auth failed:', error.response?.data || error.message);
    throw error;
  }
}
