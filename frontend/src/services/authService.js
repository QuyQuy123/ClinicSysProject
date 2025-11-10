import axios from 'axios';

// 1. Cấu hình địa chỉ Backend
const API_URL = 'http://localhost:8080/api/auth';

// 2. Tạo hàm gọi API đăng nhập
export const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + '/login', {
            username: username,
            password: password
        });

        // Trả về dữ liệu (LoginResponseDTO)
        return response.data;
    } catch (error) {
        console.error('Lỗi khi gọi API đăng nhập:', error.response || error);
        throw error; // Ném lỗi để component Login có thể bắt
    }
};

// 3. Hàm đăng xuất (để dùng sau)
export const logout = () => {
    localStorage.removeItem('clinicSysToken');
    localStorage.removeItem('clinicSysUser');
};