// import axios from 'axios'; // Bỏ dòng này
import apiClient from './api'; // <<< THÊM DÒNG NÀY

// const API_URL = 'http://localhost:8080/api/auth'; // Bỏ dòng này

export const login = async (username, password) => {
    try {
        // Sửa lại: Dùng apiClient và chỉ cần đường dẫn tương đối
        const response = await apiClient.post('/auth/login', {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API đăng nhập:', error.response || error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('clinicSysToken');
    localStorage.removeItem('clinicSysUser');
};