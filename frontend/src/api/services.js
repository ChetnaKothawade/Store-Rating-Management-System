import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  addUser: (data) => api.post('/admin/users', data),
  getStores: (params) => api.get('/admin/stores', { params }),
  addStore: (data) => api.post('/admin/stores', data),
  getStoreRatings: (id) => api.get(`/admin/stores/${id}/ratings`),
};

export const storeAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
};

export const ratingAPI = {
  submit: (data) => api.post('/ratings', data),
  update: (id, data) => api.put(`/ratings/${id}`, data),
  getMyRating: (storeId) => api.get(`/ratings/my/${storeId}`),
  getOwnerDashboard: () => api.get('/ratings/owner-dashboard'),
};
