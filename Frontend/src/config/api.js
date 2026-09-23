// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  USER: {
    REGISTER: `${API_URL}/api/v1/user/register`,
    LOGIN: `${API_URL}/api/v1/user/login`,
    LOGOUT: `${API_URL}/api/v1/user/logout`,
    VERIFY_OTP: `${API_URL}/api/v1/user/verify-otp`,
    RESEND_OTP: `${API_URL}/api/v1/user/resend-otp`,
    GET_OTHER_USERS: `${API_URL}/api/v1/user`,
    SEARCH: (query) => `${API_URL}/api/v1/user/search?query=${encodeURIComponent(query)}`,
  },
  MESSAGE: {
    SEND: (id) => `${API_URL}/api/v1/message/send/${id}`,
    GET: (id) => `${API_URL}/api/v1/message/${id}`,
    MARK_READ: (senderId) => `${API_URL}/api/v1/message/read/${senderId}`,
    EDIT: (msgId) => `${API_URL}/api/v1/message/edit/${msgId}`,
    DELETE: (msgId) => `${API_URL}/api/v1/message/delete/${msgId}`,
    REACT: (msgId) => `${API_URL}/api/v1/message/react/${msgId}`,
  }
};
