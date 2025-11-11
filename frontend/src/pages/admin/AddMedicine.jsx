import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMedicine, getAllMedicineGroups } from '../../ApiClient/medicineService';
import './StaffForm.css';

function AddMedicine() {
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMedicineGroups = async () => {
            try {
                const groups = await getAllMedicineGroups();
                setMedicineGroups(groups);
            } catch (err) {
                console.error('Error fetching medicine groups:', err);
            }
        };
        fetchMedicineGroups();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!medicineName || !medicineGroupID || !unit || !price || !stock) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setLoading(false);
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            setError('Giá thuốc phải là số hợp lệ và >= 0');
            setLoading(false);
            return;
        }

        const stockNum = parseInt(stock);
        if (isNaN(stockNum) || stockNum < 0) {
            setError('Số lượng tồn kho phải là số nguyên hợp lệ và >= 0');
            setLoading(false);
            return;
        }

        let finalMedicineCode = medicineCode;
        if (!finalMedicineCode || finalMedicineCode.trim() === '') {
            const codePrefix = medicineName.substring(0, 4).toUpperCase().replace(/\s/g, '');
            finalMedicineCode = `${codePrefix}-${Date.now().toString().slice(-3)}`;
        }

        try {
            await createMedicine({
                medicineCode: finalMedicineCode,
                medicineGroupID: parseInt(medicineGroupID),
                medicineName,
                strength: strength || null,
                unit,
                price: priceNum,
                stock: stockNum,
                status
            });
            navigate('/admin/medicines');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể tạo thuốc. Vui lòng thử lại.');
            console.error('Error creating medicine:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-form">
            <h1>Add New Medicine</h1>

            <div className="card">
                <h2>New Medicine Details</h2>
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
                            placeholder="e.g., Paracetamol"
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="medCode">
                                Medicine Code <span className="optional">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="medCode"
                                name="medCode"
                                placeholder="e.g., PARA-500"
                                value={medicineCode}
                                onChange={(e) => setMedicineCode(e.target.value)}
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
                                placeholder="e.g., 500mg"
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
                                placeholder="e.g., Viên, Gói, Lọ"
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
                                placeholder="e.g., 1000"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock">
                                Initial Stock<span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                required
                                placeholder="e.g., 100"
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
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
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Medicine'}
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

export default AddMedicine;

