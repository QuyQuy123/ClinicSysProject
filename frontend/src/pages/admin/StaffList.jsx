import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllStaff, updateStaffStatus } from '../../ApiClient/userService';
import './StaffList.css';

function StaffList() {
    const [staff, setStaff] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await getAllStaff();
                setStaff(data);
                setFilteredStaff(data);
            } catch (err) {
                setError('Không thể tải danh sách nhân viên. Bạn có phải Admin không?');
                console.error('Error fetching staff:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        let filtered = [...staff];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.fullName.toLowerCase().includes(term) || 
                s.email.toLowerCase().includes(term)
            );
        }
        if (roleFilter !== 'all') {
            if (roleFilter === 'doctor') {
                filtered = filtered.filter(s => s.roleName === 'Doctor');
            } else if (roleFilter === 'receptionist') {
                filtered = filtered.filter(s => s.roleName === 'Receptionist');
            }
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => 
                s.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredStaff(filtered);
    }, [searchTerm, roleFilter, statusFilter, staff]);

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} nhân viên này?`)) {
            return;
        }

        try {
            await updateStaffStatus(userId, newStatus);
            const data = await getAllStaff();
            setStaff(data);
        } catch (err) {
            alert('Không thể cập nhật trạng thái nhân viên. Vui lòng thử lại.');
            console.error('Error updating staff status:', err);
        }
    };

    const handleEdit = (userId) => {
        navigate(`/admin/staff/edit/${userId}`);
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
        <div className="staff-list">
            <h1>Staff Management</h1>

            <div className="card">
                <div className="controls-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                        id="roleFilter"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="doctor">Doctors Only</option>
                        <option value="receptionist">Receptionists Only</option>
                    </select>
                    
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    
                    <Link to="/admin/staff/new" className="add-btn">
                        ➕ Add New Staff
                    </Link>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email (Username)</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không tìm thấy nhân viên nào
                                </td>
                            </tr>
                        ) : (
                            filteredStaff.map(user => (
                                <tr key={user.userID}>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.roleName}</td>
                                    <td>
                                        <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(user.userID)}
                                        >
                                            Edit
                                        </button>
                                        {user.status === 'Active' ? (
                                            <button 
                                                className="deactivate-btn"
                                                onClick={() => handleStatusChange(user.userID, user.status)}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button 
                                                className="activate-btn"
                                                onClick={() => handleStatusChange(user.userID, user.status)}
                                            >
                                                Activate
                                            </button>
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

export default StaffList;
