import axios from 'axios';

// 1. Tạo một instance axios tùy chỉnh
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Địa chỉ API backend
});

// 2. Cấu hình Interceptor (Bộ chặn)
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('clinicSysToken');

        // Nếu có token, thêm vào header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Cấu hình Interceptor cho Response (Xử lý lỗi)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý lỗi 401 (Unauthorized) hoặc 403 (Forbidden)
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                // Xóa token và user info nếu không có quyền
                localStorage.removeItem('clinicSysToken');
                localStorage.removeItem('clinicSysUser');
                // Có thể redirect về trang login nếu cần
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;