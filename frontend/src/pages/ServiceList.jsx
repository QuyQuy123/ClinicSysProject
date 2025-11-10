import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllServices, getAllServiceTypes, updateServiceStatus } from '../services/serviceService';
import './ServiceList.css';

function ServiceList() {
    const [services, setServices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesData, typesData] = await Promise.all([
                    getAllServices(),
                    getAllServiceTypes()
                ]);
                setServices(servicesData);
                setFilteredServices(servicesData);
                setServiceTypes(typesData);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || 'Không thể tải danh sách dịch vụ. Vui lòng thử lại.';
                setError(errorMessage);
                console.error('Error fetching services:', err);
                console.error('Error response:', err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter services khi search term, type filter, hoặc status filter thay đổi
    useEffect(() => {
        let filtered = [...services];

        // Filter theo search term (name hoặc code)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.serviceName.toLowerCase().includes(term) || 
                s.serviceCode.toLowerCase().includes(term)
            );
        }

        // Filter theo type
        if (typeFilter !== 'all') {
            const typeId = parseInt(typeFilter);
            filtered = filtered.filter(s => s.serviceTypeID === typeId);
        }

        // Filter theo status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => 
                s.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        setFilteredServices(filtered);
    }, [searchTerm, typeFilter, statusFilter, services]);

    const handleStatusChange = async (serviceId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        
        if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} dịch vụ này?`)) {
            return;
        }

        try {
            await updateServiceStatus(serviceId, newStatus);
            // Cập nhật lại danh sách
            const data = await getAllServices();
            setServices(data);
        } catch (err) {
            alert('Không thể cập nhật trạng thái dịch vụ. Vui lòng thử lại.');
            console.error('Error updating service status:', err);
        }
    };

    const handleEdit = (serviceId) => {
        navigate(`/admin/services/edit/${serviceId}`);
    };

    const formatCurrency = (amount) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        return new Intl.NumberFormat('vi-VN').format(numAmount);
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
        <div className="service-list">
            <h1>Service List</h1>

            <div className="card">
                <div className="controls-bar">
                    <select
                        id="typeFilter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">-- All Service Types --</option>
                        {serviceTypes.map(type => (
                            <option key={type.serviceTypeID} value={type.serviceTypeID}>
                                {type.typeName}
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
                    
                    <Link to="/admin/services/new" className="add-btn">
                        New Service
                    </Link>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Service Code</th>
                            <th>Service Name</th>
                            <th>Service Type</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không tìm thấy dịch vụ nào
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map(service => (
                                <tr key={service.serviceID}>
                                    <td>{service.serviceCode}</td>
                                    <td>{service.serviceName}</td>
                                    <td>{service.serviceTypeName}</td>
                                    <td>{formatCurrency(service.price)} đ</td>
                                    <td>
                                        <span className={`status-badge ${service.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                            {service.status}
                                        </span>
                                    </td>
                                    <td className="action-links">
                                        <a 
                                            href="#" 
                                            className="edit-link"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(service.serviceID);
                                            }}
                                        >
                                            Edit
                                        </a>
                                        {service.status === 'Active' ? (
                                            <a 
                                                href="#" 
                                                className="deactivate-link"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleStatusChange(service.serviceID, service.status);
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
                                                    handleStatusChange(service.serviceID, service.status);
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

export default ServiceList;

