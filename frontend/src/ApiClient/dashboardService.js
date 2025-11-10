import apiClient from './api';

export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get('/admin/dashboard/stats');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thống kê dashboard:', error.response || error);
        throw error;
    }
};


