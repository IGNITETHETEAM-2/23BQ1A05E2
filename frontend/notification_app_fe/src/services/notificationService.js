import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const notificationService = {
  getNotifications: async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/notifications/${userId}`);
      return res.data.data || [];
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
      return [];
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/notifications/${id}/read`);
      return res.data.data;
    } catch (err) {
      console.error('Failed to mark as read:', err.message);
    }
  },

  deleteNotification: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notifications/${id}`);
    } catch (err) {
      console.error('Failed to delete notification:', err.message);
    }
  },

  createNotification: async (payload) => {
    try {
      const res = await axios.post(`${BASE_URL}/notifications`, payload);
      return res.data.data;
    } catch (err) {
      console.error('Failed to create notification:', err.message);
    }
  },
};

export default notificationService;
