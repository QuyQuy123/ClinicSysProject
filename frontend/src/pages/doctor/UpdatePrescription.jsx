import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEMRByAppointmentID, getPrescriptionByAppointmentID, searchMedicines, savePrescription } from '../../ApiClient/prescriptionService';
import BackButton from '../../components/BackButton';
import LogoutButton from '../../components/LogoutButton';
import './NewConsultation.css';

function UpdatePrescription() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [medicineSearch, setMedicineSearch] = useState('');
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [medicineQuantity, setMedicineQuantity] = useState(1);
    const [medicineNote, setMedicineNote] = useState('');
    const [medicineResults, setMedicineResults] = useState([]);
    const [showMedicineResults, setShowMedicineResults] = useState(false);
    
    // Prescription items
    const [prescriptionItems, setPrescriptionItems] = useState([]);
    const [prescriptionNotes, setPrescriptionNotes] = useState('');
    const [aiAlerts, setAiAlerts] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientInfo, prescriptionInfo] = await Promise.all([
                    getEMRByAppointmentID(parseInt(appointmentId)),
                    getPrescriptionByAppointmentID(parseInt(appointmentId))
                ]);
                setPatientData(patientInfo);
                setPrescriptionData(prescriptionInfo);
                
                // Populate prescription items if exists
                if (prescriptionInfo && prescriptionInfo.items) {
                    setPrescriptionItems(prescriptionInfo.items);
                    setPrescriptionNotes(prescriptionInfo.notes || '');
                    setAiAlerts(prescriptionInfo.aiAlerts || '');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchData();
        }
    }, [appointmentId]);

    useEffect(() => {
        const searchMedicine = async () => {
            if (medicineSearch.trim().length >= 2) {
                try {
                    const results = await searchMedicines(medicineSearch);
                    setMedicineResults(results);
                    setShowMedicineResults(true);
                } catch (err) {
                    console.error('Error searching medicines:', err);
                    setMedicineResults([]);
                    setShowMedicineResults(false);
                }
            } else {
                setMedicineResults([]);
                setShowMedicineResults(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            searchMedicine();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [medicineSearch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchInput = document.getElementById('medSearch');
            const results = document.querySelector('.medicine-results');
            if (searchInput && results && !searchInput.contains(event.target) && !results.contains(event.target)) {
                setShowMedicineResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSelectMedicine = (medicine) => {
        setSelectedMedicine(medicine);
        setMedicineSearch(medicine.medicineName + (medicine.strength ? ` ${medicine.strength}` : ''));
        setShowMedicineResults(false);
    };

    const handleAddToPrescription = () => {
        if (!selectedMedicine) {
            alert('Vui lòng chọn thuốc');
            return;
        }

        if (medicineQuantity < 1) {
            alert('Số lượng phải lớn hơn 0');
            return;
        }

        const newItem = {
            prescriptionMedicineID: editingIndex !== null ? prescriptionItems[editingIndex].prescriptionMedicineID : 0,
            medicineID: selectedMedicine.medicineID,
            medicineName: selectedMedicine.medicineName,
            medicineCode: selectedMedicine.medicineCode,
            strength: selectedMedicine.strength || '',
            quantity: medicineQuantity,
            note: medicineNote.trim()
        };

        if (editingIndex !== null) {
            // Update existing item
            const updatedItems = [...prescriptionItems];
            updatedItems[editingIndex] = newItem;
            setPrescriptionItems(updatedItems);
            setEditingIndex(null);
        } else {
            // Add new item
            setPrescriptionItems([...prescriptionItems, newItem]);
        }

        // Reset form
        setSelectedMedicine(null);
        setMedicineSearch('');
        setMedicineQuantity(1);
        setMedicineNote('');
    };

    const handleEditItem = (index) => {
        const item = prescriptionItems[index];
        setSelectedMedicine({
            medicineID: item.medicineID,
            medicineName: item.medicineName,
            medicineCode: item.medicineCode,
            strength: item.strength
        });
        setMedicineSearch(item.medicineName + (item.strength ? ` ${item.strength}` : ''));
        setMedicineQuantity(item.quantity);
        setMedicineNote(item.note || '');
        setEditingIndex(index);
    };

    const handleRemoveItem = (index) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
            const updatedItems = prescriptionItems.filter((_, i) => i !== index);
            setPrescriptionItems(updatedItems);
        }
    };

    const handleSavePrescription = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        if (prescriptionItems.length === 0) {
            alert('Vui lòng thêm ít nhất một loại thuốc vào đơn thuốc');
            setSaving(false);
            return;
        }

        try {
            await savePrescription({
                appointmentID: parseInt(appointmentId),
                notes: prescriptionNotes.trim(),
                aiAlerts: aiAlerts.trim(),
                items: prescriptionItems.map(item => ({
                    medicineID: item.medicineID,
                    quantity: item.quantity,
                    note: item.note || ''
                }))
            });

            alert('Lưu đơn thuốc thành công!');
            // Navigate back to UpdateConsultation page
            navigate(`/doctor/consultation/${appointmentId}/update`);
        } catch (err) {
            console.error('Error saving prescription:', err);
            setError('Không thể lưu đơn thuốc. Vui lòng thử lại.');
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

    if (error && !patientData) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => navigate('/doctor/dashboard')} className="action-btn">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    if (!patientData) {
        return null;
    }

    const age = patientData.age || calculateAge(patientData.dateOfBirth);
    const prescriptionCode = prescriptionData?.prescriptionCode || 'P-XXXX';

    return (
        <div className="consultation-content">
                <BackButton />
                <div className="patient-header">
                    <div className="avatar">👤</div>
                    <div className="details">
                        <h2>{patientData.patientName}</h2>
                        <p>
                            ID: {patientData.patientCode} &nbsp;&nbsp; | &nbsp;&nbsp; 
                            Date of Birth: {formatDate(patientData.dateOfBirth)} ({age} years old)
                        </p>
                    </div>
                </div>

                <div className="card">
                    <h2>Update E-Prescription (ID: {prescriptionCode})</h2>
                    {error && (
                        <div className="error-message" style={{ color: '#d32f2f', marginBottom: '15px' }}>
                            {error}
                        </div>
                    )}
                    
                    <form className="add-med-form" onSubmit={(e) => { e.preventDefault(); handleAddToPrescription(); }}>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2, position: 'relative' }}>
                                <label htmlFor="medSearch">1. Add Another Medicine</label>
                                <input
                                    type="text"
                                    id="medSearch"
                                    value={medicineSearch}
                                    onChange={(e) => {
                                        setMedicineSearch(e.target.value);
                                        setSelectedMedicine(null);
                                    }}
                                    onFocus={() => {
                                        if (medicineResults.length > 0) {
                                            setShowMedicineResults(true);
                                        }
                                    }}
                                    placeholder="Search medicine from formulary..."
                                />
                                {showMedicineResults && (
                                    <div className="medicine-results" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        zIndex: 1000,
                                        marginTop: '5px'
                                    }}>
                                        {medicineResults.length > 0 ? (
                                            medicineResults.map((medicine) => (
                                                <div
                                                    key={medicine.medicineID}
                                                    className="diagnosis-result-item"
                                                    onClick={() => handleSelectMedicine(medicine)}
                                                    style={{ padding: '12px 16px', cursor: 'pointer' }}
                                                >
                                                    <strong>{medicine.medicineName}</strong>
                                                    {medicine.strength && <span> - {medicine.strength}</span>}
                                                    <br />
                                                    <small style={{ color: '#666' }}>{medicine.medicineCode}</small>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ padding: '12px 16px', color: '#999', fontStyle: 'italic' }}>
                                                Không tìm thấy kết quả
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="medQty">2. Quantity</label>
                                <input
                                    type="number"
                                    id="medQty"
                                    value={medicineQuantity}
                                    onChange={(e) => setMedicineQuantity(parseInt(e.target.value) || 1)}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="medNotes">3. Dosage & Notes</label>
                            <textarea
                                id="medNotes"
                                rows="2"
                                value={medicineNote}
                                onChange={(e) => setMedicineNote(e.target.value)}
                                placeholder="Enter dosage, frequency, and duration..."
                            />
                        </div>
                        <button type="submit">
                            {editingIndex !== null ? 'Update Medicine' : 'Add to Prescription'}
                        </button>
                        {editingIndex !== null && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setEditingIndex(null);
                                    setSelectedMedicine(null);
                                    setMedicineSearch('');
                                    setMedicineQuantity(1);
                                    setMedicineNote('');
                                }}
                                style={{ marginLeft: '10px', backgroundColor: '#6c757d' }}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    {aiAlerts && (
                        <div className="ai-alert" style={{
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeeba',
                            color: '#856404',
                            padding: '15px',
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            <strong>✨ AI Alert:</strong> {aiAlerts}
                        </div>
                    )}

                    <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>Current Prescription Items</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Medicine</th>
                                <th>Dosage / Notes</th>
                                <th>Qty</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescriptionItems.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                        Chưa có thuốc nào trong đơn thuốc
                                    </td>
                                </tr>
                            ) : (
                                prescriptionItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.medicineName}
                                            {item.strength && <span> ({item.strength})</span>}
                                        </td>
                                        <td>{item.note || '-'}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleEditItem(index);
                                                }}
                                                style={{ color: 'blue', marginRight: '10px' }}
                                            >
                                                Edit
                                            </a>
                                            | 
                                            <a 
                                                href="#" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveItem(index);
                                                }}
                                                style={{ color: 'red', marginLeft: '10px' }}
                                            >
                                                Remove
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <form onSubmit={handleSavePrescription} style={{ marginTop: '30px' }}>
                        <div className="form-group">
                            <label htmlFor="prescriptionNotes">Prescription Notes</label>
                            <textarea
                                id="prescriptionNotes"
                                value={prescriptionNotes}
                                onChange={(e) => setPrescriptionNotes(e.target.value)}
                                placeholder="General notes for this prescription..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="aiAlerts">AI Alerts</label>
                            <textarea
                                id="aiAlerts"
                                value={aiAlerts}
                                onChange={(e) => setAiAlerts(e.target.value)}
                                placeholder="AI detected interactions or warnings..."
                                rows="2"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={saving}>
                                {saving ? 'Đang lưu...' : 'Save Prescription Changes'}
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export default UpdatePrescription;

