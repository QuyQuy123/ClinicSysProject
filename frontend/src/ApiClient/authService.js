
import apiClient from './api';
export const login = async (username, password) => {
    try {
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

