import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEMRByAppointmentID, searchICD10Codes, saveConsultation } from '../../ApiClient/emrService';
import BackButton from '../../components/BackButton';
import './NewConsultation.css';

function NewConsultation() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(null);
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
        const fetchPatientData = async () => {
            try {
                const data = await getEMRByAppointmentID(parseInt(appointmentId));
                setPatientData(data);
            } catch (err) {
                console.error('Error fetching patient data:', err);
                setError('Không thể tải dữ liệu bệnh nhân. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchPatientData();
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
            searchDiagnosis();
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

    const handleSaveNote = async (e) => {
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

            alert('Lưu consultation note thành công!');
            // Navigate back to EMR page
            navigate(`/doctor/emr/${appointmentId}`);
        } catch (err) {
            console.error('Error saving consultation:', err);
            setError('Không thể lưu consultation note. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreatePrescription = async () => {
        // Auto-save consultation note first
        try {
            await saveConsultation({
                appointmentID: parseInt(appointmentId),
                vitals: vitals.trim(),
                symptoms: symptoms.trim(),
                notes: notes.trim(),
                icd10CodeID: selectedDiagnosis ? selectedDiagnosis.codeID : null
            });
            // Navigate to Create Prescription page
            navigate(`/doctor/prescription/${appointmentId}/create`);
        } catch (err) {
            console.error('Error auto-saving consultation:', err);
            alert('Không thể tự động lưu consultation note. Vui lòng lưu thủ công trước.');
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
    const today = new Date().toLocaleDateString('vi-VN');

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
                    <h2>New Consultation Note ({today})</h2>
                    {error && (
                        <div className="error-message" style={{ color: '#d32f2f', marginBottom: '15px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSaveNote}>
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
                                onChange={(e) => setDiagnosisSearch(e.target.value)}
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
                                {saving ? 'Đang lưu...' : 'Save Note'}
                            </button>
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={handleCreatePrescription}
                            >
                                Create E-Prescription
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    );
}

export default NewConsultation;

