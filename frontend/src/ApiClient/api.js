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
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('clinicSysToken');
                localStorage.removeItem('clinicSysUser');
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;

