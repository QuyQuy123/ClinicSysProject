import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getServiceById, updateService, getAllServiceTypes } from '../services/serviceService';
import './StaffForm.css';

function UpdateService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [serviceCode, setServiceCode] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceTypeID, setServiceTypeID] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('Active');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceData, typesData] = await Promise.all([
                    getServiceById(parseInt(id)),
                    getAllServiceTypes()
                ]);
                setService(serviceData);
                setServiceCode(serviceData.serviceCode || '');
                setServiceName(serviceData.serviceName || '');
                setServiceTypeID(serviceData.serviceTypeID || '');
                setPrice(serviceData.price ? serviceData.price.toString() : '');
                setStatus(serviceData.status || 'Active');
                setServiceTypes(typesData);
            } catch (err) {
                setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại.');
                console.error('Error fetching service:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!serviceName || !serviceTypeID || !price || !status) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setSaving(false);
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Giá dịch vụ phải là số hợp lệ và >= 0');
            setSaving(false);
            return;
        }

        try {
            await updateService(parseInt(id), {
                serviceName,
                serviceTypeID: parseInt(serviceTypeID),
                price: priceNum,
                status
            });
            navigate('/admin/services');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật dịch vụ. Vui lòng thử lại.');
            console.error('Error updating service:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error && !service) {
        return (
            <div className="staff-form">
                <h1>Update Service</h1>
                <div className="card">
                    <div className="error-message">{error}</div>
                    <div className="form-actions">
                        <Link to="/admin/services">
                            <button type="button" className="cancel-btn">Quay lại</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-form">
            <h1>Update Service</h1>

            <div className="card">
                <h2>Edit Service Details</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="serviceCode">Service Code</label>
                        <input
                            type="text"
                            id="serviceCode"
                            name="serviceCode"
                            value={serviceCode}
                            readOnly
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="serviceName">
                            Service Name<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="serviceName"
                            name="serviceName"
                            required
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="serviceType">
                            Service Type<span className="required">*</span>
                        </label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            required
                            value={serviceTypeID}
                            onChange={(e) => setServiceTypeID(e.target.value)}
                        >
                            <option value="" disabled>-- Select a Type --</option>
                            {serviceTypes.map(type => (
                                <option key={type.serviceTypeID} value={type.serviceTypeID}>
                                    {type.typeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="price">
                            Price (VND)<span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required
                            min="0"
                            step="1000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">
                            Status<span className="required">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link to="/admin/services">
                            <button type="button" className="cancel-btn">
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateService;

