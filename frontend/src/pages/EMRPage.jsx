import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEMRByAppointmentID } from '../ApiClient/emrService';
import './EMRPage.css';

function EMRPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [emrData, setEmrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEMR = async () => {
            try {
                const data = await getEMRByAppointmentID(parseInt(appointmentId));
                setEmrData(data);
            } catch (err) {
                console.error('Error fetching EMR:', err);
                setError('Không thể tải dữ liệu EMR. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchEMR();
        }
    }, [appointmentId]);

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

    const handleStartNewConsultation = () => {
        navigate(`/doctor/consultation/${appointmentId}`);
    };

    const handleViewDetails = (appointmentID) => {
        navigate(`/doctor/consultation/${appointmentID}/update`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => navigate('/doctor/dashboard')} className="action-btn">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    if (!emrData) {
        return (
            <div className="error-container">
                <p>Không tìm thấy dữ liệu EMR</p>
                <button onClick={() => navigate('/doctor/dashboard')} className="action-btn">
                    Quay lại Dashboard
                </button>
            </div>
        );
    }

    const age = emrData.age || calculateAge(emrData.dateOfBirth);

    return (
        <div className="emr-container">
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
                <h1>Patient Electronic Medical Record (EMR)</h1>

                <div className="patient-header">
                    <div className="avatar">👤</div>
                    <div className="details">
                        <h2>{emrData.patientName}</h2>
                        <p>
                            ID: {emrData.patientCode} &nbsp;&nbsp; | &nbsp;&nbsp; 
                            Date of Birth: {formatDate(emrData.dateOfBirth)} ({age} years old) &nbsp;&nbsp; | &nbsp;&nbsp; 
                            Gender: {emrData.gender}
                        </p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Visit History</h2>
                        <button className="action-btn" onClick={handleStartNewConsultation}>
                            Start New Consultation
                        </button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Visit Date</th>
                                <th>Reason for Visit</th>
                                <th>Primary Diagnosis</th>
                                <th>Doctor</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emrData.visitHistory && emrData.visitHistory.length > 0 ? (
                                emrData.visitHistory.map((visit) => (
                                    <tr key={visit.appointmentID}>
                                        <td>{formatDate(visit.visitDate)}</td>
                                        <td>{visit.reasonForVisit}</td>
                                        <td>
                                            {visit.primaryDiagnosis}
                                            {visit.diagnosisCode && visit.diagnosisCode !== 'N/A' && (
                                                <span> ({visit.diagnosisCode})</span>
                                            )}
                                        </td>
                                        <td>{visit.doctorName}</td>
                                        <td>
                                            <button 
                                                className="details-btn"
                                                onClick={() => handleViewDetails(visit.appointmentID)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không có lịch sử khám bệnh
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default EMRPage;

