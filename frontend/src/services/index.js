import api from './api';

// Auth Service
export const authService = {
    // Giriş yap
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    // Kayıt ol
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },

    // Çıkış yap
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Kullanıcı bilgisi al
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Token kontrol et
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Animal Service
export const animalService = {
    getAll: (params) => api.get('/animals', { params }),
    getById: (id) => api.get(`/animals/${id}`),
    create: (data) => api.post('/animals', data),
    update: (id, data) => api.put(`/animals/${id}`, data),
    delete: (id) => api.delete(`/animals/${id}`),
    getStats: () => api.get('/animals/stats')
};

// Barn Service
export const barnService = {
    getAll: () => api.get('/barns'),
    getById: (id) => api.get(`/barns/${id}`),
    create: (data) => api.post('/barns', data),
    update: (id, data) => api.put(`/barns/${id}`, data),
    delete: (id) => api.delete(`/barns/${id}`)
};

// Health Record Service
export const healthRecordService = {
    getAll: (params) => api.get('/health-records', { params }),
    getById: (id) => api.get(`/health-records/${id}`),
    create: (data) => api.post('/health-records', data),
    update: (id, data) => api.put(`/health-records/${id}`, data),
    delete: (id) => api.delete(`/health-records/${id}`)
};

// Feeding Record Service
export const feedingRecordService = {
    getAll: (params) => api.get('/feeding-records', { params }),
    getById: (id) => api.get(`/feeding-records/${id}`),
    create: (data) => api.post('/feeding-records', data),
    update: (id, data) => api.put(`/feeding-records/${id}`, data),
    delete: (id) => api.delete(`/feeding-records/${id}`)
};

// Production Record Service
export const productionRecordService = {
    getAll: (params) => api.get('/production-records', { params }),
    getById: (id) => api.get(`/production-records/${id}`),
    create: (data) => api.post('/production-records', data),
    update: (id, data) => api.put(`/production-records/${id}`, data),
    delete: (id) => api.delete(`/production-records/${id}`),
    getStats: (params) => api.get('/production-records/stats', { params })
};

// Employee Service
export const employeeService = {
    getAll: (params) => api.get('/employees', { params }),
    getById: (id) => api.get(`/employees/${id}`),
    create: (data) => api.post('/employees', data),
    update: (id, data) => api.put(`/employees/${id}`, data),
    delete: (id) => api.delete(`/employees/${id}`)
};

// Task Service
export const taskService = {
    getAll: (params) => api.get('/tasks', { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
    getStats: () => api.get('/tasks/stats')
};

// User Service (Admin Only)
export const userService = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    resetPassword: (id, new_password) => api.post(`/users/${id}/reset-password`, { new_password }),
    toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
    getSystemStats: () => api.get('/users/stats'),
    getActivityLogs: (limit = 50) => api.get('/users/activity-logs', { params: { limit } })
};

export { default as dashboardService } from './dashboardService';
