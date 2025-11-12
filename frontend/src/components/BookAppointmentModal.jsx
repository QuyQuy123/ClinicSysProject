import React, { useState, useEffect } from 'react';
import { searchPatientsByName, getAllDoctors, getAllServices, createAppointment } from '../ApiClient/receptionistService';
import './BookAppointmentModal.css';

function BookAppointmentModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        patientID: '',
        patientName: '',
        doctorID: '',
        serviceID: '',
        date: '',
        time: '',
        note: ''
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            fetchServices();
            // Reset form
            setFormData({
                patientID: '',
                patientName: '',
                doctorID: '',
                serviceID: '',
                date: '',
                time: '',
                note: ''
            });
            setSearchTerm('');
            setSearchResults([]);
            setError('');
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data || []);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            // Don't show error to user, just log it
        }
    };

    const fetchServices = async () => {
        try {
            const data = await getAllServices();
            setServices(data || []);
        } catch (err) {
            console.error('Error fetching services:', err);
            // Don't show error to user, just log it
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        try {
            const results = await searchPatientsByName(searchTerm);
            setSearchResults(results || []);
            setShowSearchResults(true);
        } catch (err) {
            console.error('Error searching patients:', err);
            setSearchResults([]);
            setShowSearchResults(false);
            // Don't set error state for search, just log it
        }
    };

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            const timeoutId = setTimeout(() => {
                handleSearch();
            }, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleSelectPatient = (patient) => {
        setFormData({
            ...formData,
            patientID: patient.patientID,
            patientName: patient.fullName
        });
        setSearchTerm(patient.fullName);
        setShowSearchResults(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.patientID) {
            setError('Vui lòng chọn bệnh nhân');
            return;
        }
        if (!formData.doctorID) {
            setError('Vui lòng chọn bác sĩ');
            return;
        }
        if (!formData.date || !formData.time) {
            setError('Vui lòng chọn ngày và giờ');
            return;
        }

        try {
            setLoading(true);
            
            // Combine date and time
            const dateTimeString = `${formData.date}T${formData.time}:00`;
            const dateTime = new Date(dateTimeString).toISOString();

            const appointmentData = {
                patientID: parseInt(formData.patientID),
                doctorID: parseInt(formData.doctorID),
                dateTime: dateTimeString,
                serviceID: formData.serviceID ? parseInt(formData.serviceID) : null,
                note: formData.note || null
            };

            await createAppointment(appointmentData);
            
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            console.error('Error creating appointment:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo lịch hẹn. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content book-appointment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Book Appointment</h2>
                    <button className="modal-close-btn" onClick={onClose} disabled={loading}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Search Patient */}
                    <div className="form-group">
                        <label htmlFor="patientSearch">
                            Search Patient <span className="required">*</span>
                        </label>
                        <div className="search-container">
                            <input
                                type="text"
                                id="patientSearch"
                                className="form-control"
                                placeholder="Nhập tên bệnh nhân để tìm kiếm..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    if (value.trim().length === 0) {
                                        setFormData({ ...formData, patientID: '', patientName: '' });
                                        setSearchResults([]);
                                        setShowSearchResults(false);
                                    }
                                }}
                                onFocus={() => {
                                    if (searchResults.length > 0 && searchTerm.trim().length >= 2) {
                                        setShowSearchResults(true);
                                    }
                                }}
                                onBlur={() => {
                                    // Delay hiding results to allow click on result item
                                    setTimeout(() => {
                                        setShowSearchResults(false);
                                    }, 200);
                                }}
                                required
                            />
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="search-results">
                                    {searchResults.map((patient) => (
                                        <div
                                            key={patient.patientID}
                                            className="search-result-item"
                                            onClick={() => handleSelectPatient(patient)}
                                        >
                                            <div className="patient-name">{patient.fullName}</div>
                                            <div className="patient-info">
                                                {patient.patientCode} | {patient.phone}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {showSearchResults && searchResults.length === 0 && searchTerm.trim().length >= 2 && (
                                <div className="search-results">
                                    <div className="no-results">Không tìm thấy bệnh nhân</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Doctor Selection */}
                    <div className="form-group">
                        <label htmlFor="doctorID">
                            Doctor <span className="required">*</span>
                        </label>
                        <select
                            id="doctorID"
                            name="doctorID"
                            className="form-control"
                            value={formData.doctorID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.userID} value={doctor.userID}>
                                    {doctor.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Service Selection */}
                    <div className="form-group">
                        <label htmlFor="serviceID">Service (Optional)</label>
                        <select
                            id="serviceID"
                            name="serviceID"
                            className="form-control"
                            value={formData.serviceID}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn dịch vụ (tùy chọn) --</option>
                            {services.map((service) => (
                                <option key={service.serviceID} value={service.serviceID}>
                                    {service.serviceName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label htmlFor="date">
                            Date <span className="required">*</span>
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            min={today}
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="form-group">
                        <label htmlFor="time">
                            Time <span className="required">*</span>
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            className="form-control"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Note */}
                    <div className="form-group">
                        <label htmlFor="note">Note (Optional)</label>
                        <textarea
                            id="note"
                            name="note"
                            className="form-control"
                            rows="3"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Ghi chú (nếu có)..."
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookAppointmentModal;

