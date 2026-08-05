// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  USER: {
    REGISTER: `${API_URL}/api/v1/user/register`,
    LOGIN: `${API_URL}/api/v1/user/login`,
    LOGOUT: `${API_URL}/api/v1/user/logout`,
    GET_OTHER_USERS: `${API_URL}/api/v1/user`,
  },
  MESSAGE: {
    SEND: (id) => `${API_URL}/api/v1/message/send/${id}`,
    GET: (id) => `${API_URL}/api/v1/message/${id}`,
  }
};
