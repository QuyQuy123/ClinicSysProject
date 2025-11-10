import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createService, getAllServiceTypes } from '../services/serviceService';
import './StaffForm.css';

function AddService() {
    const [serviceCode, setServiceCode] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceTypeID, setServiceTypeID] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('Active');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const types = await getAllServiceTypes();
                setServiceTypes(types);
            } catch (err) {
                console.error('Error fetching service types:', err);
            }
        };
        fetchServiceTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!serviceCode || !serviceName || !serviceTypeID || !price) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setLoading(false);
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Giá dịch vụ phải là số hợp lệ và >= 0');
            setLoading(false);
            return;
        }

        try {
            await createService({
                serviceCode,
                serviceTypeID: parseInt(serviceTypeID),
                serviceName,
                price: priceNum,
                status
            });
            navigate('/admin/services');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể tạo dịch vụ. Vui lòng thử lại.');
            console.error('Error creating service:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-form">
            <h1>Add New Service</h1>

            <div className="card">
                <h2>New Service Details</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="serviceCode">
                            Service Code<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="serviceCode"
                            name="serviceCode"
                            required
                            placeholder="e.g., K-002, XN-003"
                            value={serviceCode}
                            onChange={(e) => setServiceCode(e.target.value)}
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
                            placeholder="e.g., Khám chuyên khoa Tim mạch"
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
                            placeholder="e.g., 250000"
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
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Service'}
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

export default AddService;

