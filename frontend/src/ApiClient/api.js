import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Địa chỉ API backend
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('clinicSysToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Only clear token and logout if it's a real authentication error
            // Don't clear token for 403 if it's just a permission issue (user is authenticated but lacks permission)
            if (error.response.status === 401) {
                // 401 = Unauthorized - token is invalid or expired
                localStorage.removeItem('clinicSysToken');
                localStorage.removeItem('clinicSysUser');
                // Redirect to login only if we're not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (error.response.status === 403) {
                // 403 = Forbidden - user is authenticated but doesn't have permission
                // Don't clear token, just show error
                // Only clear token if it's a repeated 403 (might indicate token issue)
                console.warn('Access forbidden. User may not have permission for this resource.');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

