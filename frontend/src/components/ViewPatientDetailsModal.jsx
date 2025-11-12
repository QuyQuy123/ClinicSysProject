import React from 'react';
import './ViewPatientDetailsModal.css';

function ViewPatientDetailsModal({ isOpen, onClose, patient }) {
    if (!isOpen || !patient) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatGender = (gender) => {
        if (!gender) return 'N/A';
        // Handle Vietnamese gender values
        if (gender.toLowerCase().includes('nam') || gender.toLowerCase() === 'male') {
            return 'Male';
        }
        if (gender.toLowerCase().includes('nữ') || gender.toLowerCase() === 'female') {
            return 'Female';
        }
        if (gender.toLowerCase().includes('khác') || gender.toLowerCase() === 'other') {
            return 'Other';
        }
        // Return as is if it's already in English
        return gender;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Patient Details</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <div className="detail-row">
                            <div className="detail-label">Patient ID:</div>
                            <div className="detail-value">{patient.patientCode}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Full Name:</div>
                            <div className="detail-value">{patient.fullName}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Date of Birth:</div>
                            <div className="detail-value">{formatDate(patient.dateOfBirth)}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Gender:</div>
                            <div className="detail-value">{formatGender(patient.gender)}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Address:</div>
                            <div className="detail-value">{patient.address || 'N/A'}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Phone:</div>
                            <div className="detail-value">{patient.phone}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Email:</div>
                            <div className="detail-value">{patient.email || 'N/A'}</div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button className="close-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewPatientDetailsModal;

