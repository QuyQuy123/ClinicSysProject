import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getMedicineById, updateMedicine, getAllMedicineGroups } from '../../ApiClient/medicineService';
import './StaffForm.css';

function UpdateMedicine() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState(null);
    const [medicineCode, setMedicineCode] = useState('');
    const [medicineName, setMedicineName] = useState('');
    const [medicineGroupID, setMedicineGroupID] = useState('');
    const [strength, setStrength] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [status, setStatus] = useState('Active');
    const [medicineGroups, setMedicineGroups] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [medicineData, groupsData] = await Promise.all([
                    getMedicineById(parseInt(id)),
                    getAllMedicineGroups()
                ]);
                setMedicine(medicineData);
                setMedicineCode(medicineData.medicineCode || '');
                setMedicineName(medicineData.medicineName || '');
                setMedicineGroupID(medicineData.medicineGroupID || '');
                setStrength(medicineData.strength || '');
                setUnit(medicineData.unit || '');
                setPrice(medicineData.price ? medicineData.price.toString() : '');
                setStock(medicineData.stock ? medicineData.stock.toString() : '');
                setStatus(medicineData.status || 'Active');
                setMedicineGroups(groupsData);
            } catch (err) {
                setError('Không thể tải thông tin thuốc. Vui lòng thử lại.');
                console.error('Error fetching medicine:', err);
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

        if (!medicineName || !medicineGroupID || !unit || !price || !status) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setSaving(false);
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Giá thuốc phải là số hợp lệ và >= 0');
            setSaving(false);
            return;
        }

        try {
            await updateMedicine(parseInt(id), {
                medicineName,
                medicineGroupID: parseInt(medicineGroupID),
                strength: strength || null,
                unit,
                price: priceNum,
                status
            });
            navigate('/admin/medicines');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật thuốc. Vui lòng thử lại.');
            console.error('Error updating medicine:', err);
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

    if (error && !medicine) {
        return (
            <div className="staff-form">
                <h1>Update Medicine</h1>
                <div className="card">
                    <div className="error-message">{error}</div>
                    <div className="form-actions">
                        <Link to="/admin/medicines">
                            <button type="button" className="cancel-btn">Quay lại</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-form">
            <h1>Update Medicine</h1>

            <div className="card">
                <h2>Edit Medicine Details</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="medName">
                            Medicine Name<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="medName"
                            name="medName"
                            required
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="medCode">Medicine Code</label>
                            <input
                                type="text"
                                id="medCode"
                                name="medCode"
                                value={medicineCode}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="medGroup">
                                Medicine Group<span className="required">*</span>
                            </label>
                            <select
                                id="medGroup"
                                name="medGroup"
                                required
                                value={medicineGroupID}
                                onChange={(e) => setMedicineGroupID(e.target.value)}
                            >
                                <option value="" disabled>-- Select a Group --</option>
                                {medicineGroups.map(group => (
                                    <option key={group.medicineGroupID} value={group.medicineGroupID}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="strength">Strength</label>
                            <input
                                type="text"
                                id="strength"
                                name="strength"
                                value={strength}
                                onChange={(e) => setStrength(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="unit">
                                Unit<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                required
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock">Current Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                value={stock}
                                readOnly
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
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link to="/admin/medicines">
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

export default UpdateMedicine;

