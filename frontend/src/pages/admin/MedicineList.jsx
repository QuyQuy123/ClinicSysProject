import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllMedicines, getAllMedicineGroups, updateMedicineStatus } from '../../ApiClient/medicineService';
import './MedicineList.css';

function MedicineList() {
    const [medicines, setMedicines] = useState([]);
    const [medicineGroups, setMedicineGroups] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [groupFilter, setGroupFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medicinesData, groupsData] = await Promise.all([
                    getAllMedicines(),
                    getAllMedicineGroups()
                ]);
                setMedicines(medicinesData);
                setFilteredMedicines(medicinesData);
                setMedicineGroups(groupsData);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Không thể tải danh sách thuốc. Vui lòng thử lại.';
                setError(errorMessage);
                console.error('Error fetching medicines:', err);
                console.error('Error response:', err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = [...medicines];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(m => 
                m.medicineName.toLowerCase().includes(term) || 
                m.medicineCode.toLowerCase().includes(term)
            );
        }

        if (groupFilter !== 'all') {
            const groupId = parseInt(groupFilter);
            filtered = filtered.filter(m => m.medicineGroupID === groupId);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(m => 
                m.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredMedicines(filtered);
    }, [searchTerm, groupFilter, statusFilter, medicines]);

    const handleStatusChange = async (medicineId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} thuốc này?`)) {
            return;
        }

        try {
            await updateMedicineStatus(medicineId, newStatus);
            const data = await getAllMedicines();
            setMedicines(data);
        } catch (err) {
            alert('Không thể cập nhật trạng thái thuốc. Vui lòng thử lại.');
            console.error('Error updating medicine status:', err);
        }
    };

    const handleEdit = (medicineId) => {
        navigate(`/admin/medicines/edit/${medicineId}`);
    };

    const formatCurrency = (amount) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        return new Intl.NumberFormat('vi-VN').format(numAmount);
    };

    const getStockClass = (stock) => {
        if (stock === 0) return 'stock-zero';
        if (stock < 10) return 'stock-low';
        return '';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="medicine-list">
            <h1>Medicine List</h1>

            <div className="card">
                <div className="controls-bar">
                    <select
                        id="groupFilter"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                    >
                        <option value="all">-- All Medicine Groups --</option>
                        {medicineGroups.map(group => (
                            <option key={group.medicineGroupID} value={group.medicineGroupID}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">-- All Statuses --</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <Link to="/admin/medicines/new" className="add-btn">
                        New Medicine
                    </Link>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Medicine Code</th>
                            <th>Medicine Name</th>
                            <th>Medicine Group</th>
                            <th>Strength</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không tìm thấy thuốc nào
                                </td>
                            </tr>
                        ) : (
                            filteredMedicines.map(medicine => (
                                <tr key={medicine.medicineID}>
                                    <td>{medicine.medicineCode}</td>
                                    <td>{medicine.medicineName}</td>
                                    <td>{medicine.medicineGroupName}</td>
                                    <td>{medicine.strength || '-'}</td>
                                    <td>{medicine.unit || '-'}</td>
                                    <td>{formatCurrency(medicine.price)} đ</td>
                                    <td className={getStockClass(medicine.stock)}>
                                        {medicine.stock}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${medicine.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                            {medicine.status}
                                        </span>
                                    </td>
                                    <td className="action-links">
                                        <a 
                                            href="#" 
                                            className="edit-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(medicine.medicineID);
                                            }}
                                        >
                                            Edit
                                        </a>
                                        {medicine.status === 'Active' ? (
                                            <a 
                                                href="#" 
                                                className="deactivate-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(medicine.medicineID, medicine.status);
                                                }}
                                            >
                                                Deactivate
                                            </a>
                                        ) : (
                                            <a 
                                                href="#" 
                                                className="activate-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(medicine.medicineID, medicine.status);
                                                }}
                                            >
                                                Activate
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MedicineList;

