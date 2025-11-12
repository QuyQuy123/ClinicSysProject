import React, { useState, useEffect } from 'react';
import { getAppointmentById, updateAppointmentStatus } from '../ApiClient/receptionistService';
import './AppointmentDetailsModal.css';

function AppointmentDetailsModal({ isOpen, onClose, onSuccess, appointment }) {
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && appointment) {
            fetchAppointmentDetails();
        }
    }, [isOpen, appointment]);

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            setError('');
            const details = await getAppointmentById(appointment.appointmentID);
            setAppointmentDetails(details);
        } catch (err) {
            console.error('Error fetching appointment details:', err);
            setError('Không thể tải thông tin lịch hẹn. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const date = new Date(dateTimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${day}/${month}/${year} ${displayHours}:${displayMinutes} ${ampm}`;
    };

    const formatGender = (gender) => {
        if (!gender) return 'N/A';
        if (gender.toLowerCase().includes('nam') || gender.toLowerCase() === 'male') {
            return 'Male';
        }
        if (gender.toLowerCase().includes('nữ') || gender.toLowerCase() === 'female') {
            return 'Female';
        }
        if (gender.toLowerCase().includes('khác') || gender.toLowerCase() === 'other') {
            return 'Other';
        }
        return gender;
    };

    const handleCheckIn = async () => {
        if (!appointmentDetails) return;

        if (window.confirm('Bạn có chắc chắn muốn check-in bệnh nhân này?')) {
            try {
                setUpdating(true);
                setError('');
                await updateAppointmentStatus(appointmentDetails.appointmentID, 'Checked-in');
                
                // Refresh appointment details
                await fetchAppointmentDetails();
                
                // Call success callback to refresh calendar
                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error('Error updating appointment status:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại.';
                setError(errorMessage);
            } finally {
                setUpdating(false);
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('scheduled')) {
            return 'status-badge status-scheduled';
        } else if (statusLower.includes('checked-in') || statusLower.includes('check-in')) {
            return 'status-badge status-checked-in';
        } else if (statusLower.includes('in consultation')) {
            return 'status-badge status-in-consultation';
        } else if (statusLower.includes('completed')) {
            return 'status-badge status-completed';
        }
        return 'status-badge';
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content appointment-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Appointment Details</h2>
                    <button className="modal-close-btn" onClick={onClose} disabled={updating}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Đang tải...</p>
                        </div>
                    ) : error && !appointmentDetails ? (
                        <div className="error-message">
                            {error}
                        </div>
                    ) : appointmentDetails ? (
                        <>
                            {/* Appointment Information */}
                            <div className="detail-section">
                                <h3>Appointment Information</h3>
                                <div className="detail-row">
                                    <div className="detail-label">Appointment ID:</div>
                                    <div className="detail-value">#{appointmentDetails.appointmentID}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Date & Time:</div>
                                    <div className="detail-value">{formatDateTime(appointmentDetails.dateTime)}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Status:</div>
                                    <div className="detail-value">
                                        <span className={getStatusBadgeClass(appointmentDetails.status)}>
                                            {appointmentDetails.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Doctor:</div>
                                    <div className="detail-value">{appointmentDetails.doctorName}</div>
                                </div>
                            </div>

                            {/* Patient Information */}
                            <div className="detail-section">
                                <h3>Patient Information</h3>
                                <div className="detail-row">
                                    <div className="detail-label">Patient ID:</div>
                                    <div className="detail-value">{appointmentDetails.patientCode}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Full Name:</div>
                                    <div className="detail-value">{appointmentDetails.patientName}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Date of Birth:</div>
                                    <div className="detail-value">{formatDate(appointmentDetails.patientDateOfBirth)}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Gender:</div>
                                    <div className="detail-value">{formatGender(appointmentDetails.patientGender)}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Address:</div>
                                    <div className="detail-value">{appointmentDetails.patientAddress || 'N/A'}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Phone:</div>
                                    <div className="detail-value">{appointmentDetails.patientPhone}</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Email:</div>
                                    <div className="detail-value">{appointmentDetails.patientEmail || 'N/A'}</div>
                                </div>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="modal-actions">
                                {appointmentDetails.status && 
                                 appointmentDetails.status.toLowerCase().includes('scheduled') && (
                                    <button
                                        className="checkin-btn"
                                        onClick={handleCheckIn}
                                        disabled={updating}
                                    >
                                        {updating ? 'Processing...' : 'Check-in Patient'}
                                    </button>
                                )}
                                <button
                                    className="close-btn"
                                    onClick={onClose}
                                    disabled={updating}
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default AppointmentDetailsModal;

