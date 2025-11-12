import React, { useState, useEffect } from 'react';
import { updatePatient } from '../ApiClient/patientService';
import './AddPatientModal.css';

function EditPatientModal({ isOpen, onClose, onSuccess, patient }) {
    const [formData, setFormData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patient && isOpen) {
            // Format date for input (YYYY-MM-DD)
            const dateOfBirth = patient.dateOfBirth 
                ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
                : '';
            
            setFormData({
                fullName: patient.fullName || '',
                dateOfBirth: dateOfBirth,
                gender: patient.gender || '',
                address: patient.address || '',
                phone: patient.phone || '',
                email: patient.email || ''
            });
            setError('');
        }
    }, [patient, isOpen]);

    if (!isOpen || !patient) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!formData.fullName || !formData.dateOfBirth || !formData.gender || !formData.phone) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setLoading(false);
            return;
        }

        try {
            const patientData = {
                fullName: formData.fullName.trim(),
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                address: formData.address.trim() || null,
                phone: formData.phone.trim(),
                email: formData.email.trim() || null
            };

            await updatePatient(patient.patientID, patientData);
            
            // Call success callback
            if (onSuccess) {
                onSuccess();
            }
            
            // Close modal
            onClose();
        } catch (err) {
            console.error('Error updating patient:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật bệnh nhân. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError('');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Patient</h2>
                    <button className="modal-close-btn" onClick={handleClose} disabled={loading}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">
                                Full Name<span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Enter patient's full name"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfBirth">
                                Date of Birth<span className="required">*</span>
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                max={new Date().toISOString().split('T')[0]}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">
                                Gender<span className="required">*</span>
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="" disabled>-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter patient's address"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                Phone<span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter phone number (e.g., 09xxxxxxx)"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address (optional)"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="error-message" style={{ 
                                color: '#d32f2f', 
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#ffebee',
                                borderRadius: '5px'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Patient'}
                            </button>
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditPatientModal;

