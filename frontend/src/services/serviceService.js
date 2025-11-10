import apiClient from './api';

export const getAllServices = async () => {
    try {
        const response = await apiClient.get('/admin/services');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách dịch vụ:', error.response || error);
        throw error;
    }
};

export const getServiceById = async (serviceId) => {
    try {
        const response = await apiClient.get(`/admin/services/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin dịch vụ:', error.response || error);
        throw error;
    }
};

export const getAllServiceTypes = async () => {
    try {
        const response = await apiClient.get('/admin/services/types');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách loại dịch vụ:', error.response || error);
        throw error;
    }
};

export const createService = async (serviceData) => {
    try {
        const response = await apiClient.post('/admin/services', serviceData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo dịch vụ:', error.response || error);
        throw error;
    }
};

export const updateService = async (serviceId, serviceData) => {
    try {
        const response = await apiClient.put(`/admin/services/${serviceId}`, serviceData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ:', error.response || error);
        throw error;
    }
};

export const updateServiceStatus = async (serviceId, status) => {
    try {
        const response = await apiClient.put(`/admin/services/${serviceId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái dịch vụ:', error.response || error);
        throw error;
    }
};

