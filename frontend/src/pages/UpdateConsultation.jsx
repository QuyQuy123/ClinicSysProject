import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEMRByAppointmentID, getConsultationData, searchICD10Codes, saveConsultation } from '../ApiClient/emrService';
import './NewConsultation.css';

function UpdateConsultation() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
    const [consultationData, setConsultationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [vitals, setVitals] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');
    const [diagnosisSearch, setDiagnosisSearch] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [diagnosisResults, setDiagnosisResults] = useState([]);
    const [showDiagnosisResults, setShowDiagnosisResults] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientInfo, consultationInfo] = await Promise.all([
                    getEMRByAppointmentID(parseInt(appointmentId)),
                    getConsultationData(parseInt(appointmentId))
                ]);
                setPatientData(patientInfo);
                setConsultationData(consultationInfo);
                
                // Populate form with existing data
                if (consultationInfo) {
                    setVitals(consultationInfo.vitals || '');
                    setSymptoms(consultationInfo.symptoms || '');
                    setNotes(consultationInfo.notes || '');
                    
                    if (consultationInfo.icd10CodeID) {
                        setSelectedDiagnosis({
                            codeID: consultationInfo.icd10CodeID,
                            code: consultationInfo.icd10Code,
                            description: consultationInfo.icd10Description
                        });
                        setDiagnosisSearch(
                            consultationInfo.icd10Code && consultationInfo.icd10Description
                                ? `${consultationInfo.icd10Code} - ${consultationInfo.icd10Description}`
                                : ''
                        );
                    }
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
        const searchDiagnosis = async () => {
            if (diagnosisSearch.trim().length >= 2) {
                try {
                    const results = await searchICD10Codes(diagnosisSearch);
                    setDiagnosisResults(results);
                    setShowDiagnosisResults(true);
                } catch (err) {
                    console.error('Error searching ICD10:', err);
                    setDiagnosisResults([]);
                    setShowDiagnosisResults(false);
                }
            } else {
                setDiagnosisResults([]);
                setShowDiagnosisResults(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            if (diagnosisSearch.trim().length >= 2) {
                searchDiagnosis();
            } else {
                setDiagnosisResults([]);
                setShowDiagnosisResults(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [diagnosisSearch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const diagnosisGroup = document.querySelector('.diagnosis-group');
            if (diagnosisGroup && !diagnosisGroup.contains(event.target)) {
                setShowDiagnosisResults(false);
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

    const handleSelectDiagnosis = (diagnosis) => {
        setSelectedDiagnosis(diagnosis);
        setDiagnosisSearch(`${diagnosis.code} - ${diagnosis.description}`);
        setShowDiagnosisResults(false);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await saveConsultation({
                appointmentID: parseInt(appointmentId),
                vitals: vitals.trim(),
                symptoms: symptoms.trim(),
                notes: notes.trim(),
                icd10CodeID: selectedDiagnosis ? selectedDiagnosis.codeID : null
            });

            alert('Lưu thay đổi thành công!');
            // Navigate back to EMR page
            navigate(`/doctor/emr/${appointmentId}`);
        } catch (err) {
            console.error('Error saving consultation:', err);
            setError('Không thể lưu thay đổi. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditPrescription = () => {
        // TODO: Implement edit prescription
        alert('Chức năng chỉnh sửa đơn thuốc sẽ được triển khai sau');
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
    const today = new Date().toLocaleDateString('vi-VN');

    return (
        <div className="consultation-container">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                <nav>
                    <ul>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/doctor/dashboard'); }}>
                                <span className="icon">🏠</span> Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">👥</span> Patient Queue
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
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
                    <h2>Update Consultation Note ({today})</h2>
                    {error && (
                        <div className="error-message" style={{ color: '#d32f2f', marginBottom: '15px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSaveChanges}>
                        <div className="form-group">
                            <label htmlFor="vitals">Vitals (BP, Temp, etc.)</label>
                            <input
                                type="text"
                                id="vitals"
                                name="vitals"
                                value={vitals}
                                onChange={(e) => setVitals(e.target.value)}
                                placeholder="e.g., BP: 120/80, Temp: 37.0°C"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="symptoms">Symptoms (Patient Reported)</label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="e.g., Patient reports dry cough for 3 days, mild fever..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Examination Notes (Doctor's Findings)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g., Throat appears red, no swelling..."
                            />
                        </div>

                        <div className="form-group diagnosis-group">
                            <label htmlFor="diagnosis">Diagnosis (ICD-10)</label>
                            <input
                                type="text"
                                id="diagnosis"
                                name="diagnosis"
                                value={diagnosisSearch}
                                onChange={(e) => {
                                    setDiagnosisSearch(e.target.value);
                                    setSelectedDiagnosis(null);
                                }}
                                onFocus={() => {
                                    if (diagnosisResults.length > 0) {
                                        setShowDiagnosisResults(true);
                                    }
                                }}
                                placeholder="Search by code or description (e.g., 'J00' or 'common cold')"
                            />
                            <button type="button" className="ai-btn">✨ AI Suggest</button>
                            {showDiagnosisResults && (
                                <div className="diagnosis-results">
                                    {diagnosisResults.length > 0 ? (
                                        diagnosisResults.map((diagnosis) => (
                                            <div
                                                key={diagnosis.codeID}
                                                className="diagnosis-result-item"
                                                onClick={() => handleSelectDiagnosis(diagnosis)}
                                            >
                                                <strong>{diagnosis.code}</strong> - {diagnosis.description}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="diagnosis-result-item" style={{ color: '#999', fontStyle: 'italic' }}>
                                            Không tìm thấy kết quả
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn" disabled={saving}>
                                {saving ? 'Đang lưu...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleEditPrescription}
                            >
                                Edit E-Prescription
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateConsultation;

