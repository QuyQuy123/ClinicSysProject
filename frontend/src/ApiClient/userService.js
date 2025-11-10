import apiClient from './api';

export const getAllStaff = async () => {
    try {
        const response = await apiClient.get('/admin/staff');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error.response || error);
        throw error;
    }
};

export const createStaff = async (staffData) => {
    try {
        const payload = {
            fullName: staffData.fullName,
            email: staffData.email,
            roleID: staffData.roleName === 'Doctor' ? 2 : 3
        };
        const response = await apiClient.post('/admin/staff', payload);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo nhân viên:', error.response || error);
        throw error;
    }
};

export const getStaffById = async (userId) => {
    try {
        const response = await apiClient.get(`/admin/staff/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error.response || error);
        throw error;
    }
};

export const updateStaff = async (userId, staffData) => {
    try {
        const response = await apiClient.put(`/admin/staff/${userId}`, staffData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật nhân viên:', error.response || error);
        throw error;
    }
};

export const updateStaffStatus = async (userId, status) => {
    try {
        const response = await apiClient.put(`/admin/staff/${userId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái nhân viên:', error.response || error);
        throw error;
    }
};

export const resetPassword = async (userId) => {
    try {
        const response = await apiClient.put(`/admin/staff/${userId}/reset-password`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi reset mật khẩu:', error.response || error);
        throw error;
    }
};

