import apiClient from './api';

export const getAllMedicines = async () => {
    try {
        const response = await apiClient.get('/admin/medicines');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thuốc:', error.response || error);
        throw error;
    }
};

export const getMedicineById = async (medicineId) => {
    try {
        const response = await apiClient.get(`/admin/medicines/${medicineId}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy thông tin thuốc:', error.response || error);
        throw error;
    }
};

export const getAllMedicineGroups = async () => {
    try {
        const response = await apiClient.get('/admin/medicines/groups');
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhóm thuốc:', error.response || error);
        throw error;
    }
};

export const createMedicine = async (medicineData) => {
    try {
        const response = await apiClient.post('/admin/medicines', medicineData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tạo thuốc:', error.response || error);
        throw error;
    }
};

export const updateMedicine = async (medicineId, medicineData) => {
    try {
        const response = await apiClient.put(`/admin/medicines/${medicineId}`, medicineData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật thuốc:', error.response || error);
        throw error;
    }
};

export const updateMedicineStatus = async (medicineId, status) => {
    try {
        const response = await apiClient.put(`/admin/medicines/${medicineId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái thuốc:', error.response || error);
        throw error;
    }
};


