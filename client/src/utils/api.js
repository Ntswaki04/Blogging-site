const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://blogging-site-server-7mvm.onrender.com/api';

const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const authAPI = {
    signup: (userData) => apiRequest('/auth/signup', { method: 'POST', body: userData }),
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
};

export const postsAPI = {
    getAll: () => apiRequest('/posts'),
    getById: (id) => apiRequest(`/posts/${id}`),

    create: (postData) => {

        if (postData instanceof FormData) {
            return apiRequest('/posts', {
                method: 'POST',
                body: postData
            });
        } else {

            return apiRequest('/posts', {
                method: 'POST',
                body: postData
            });
        }
    },

    update: (id, postData) => apiRequest(`/posts/${id}`, { method: 'PUT', body: postData }),
    delete: (id) => apiRequest(`/posts/${id}`, { method: 'DELETE' }),

    getComments: (postId) => apiRequest(`/posts/${postId}/comments`),
    addComment: (postId, commentData) => apiRequest(`/posts/${postId}/comments`, {
        method: 'POST',
        body: commentData
    }),
    deleteComment: (postId, commentId) => apiRequest(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
    }),
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const getUserFullName = () => {
    const user = getCurrentUser();
    return user ? `${user.name} ${user.surname}` : '';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '';
};

export default apiRequest;