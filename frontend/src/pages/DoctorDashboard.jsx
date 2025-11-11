import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoctorDashboard } from '../ApiClient/doctorService';
import { startConsultation } from '../ApiClient/emrService';
import './DoctorDashboard.css';

function DoctorDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        doctorName: '',
        todayAppointments: [],
        waitingQueue: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboard();
    }, []);

    // Refresh when component becomes visible again (when returning from EMR page)
    useEffect(() => {
        const handleFocus = () => {
            fetchDashboard();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Waiting':
                return 'status-badge status-waiting';
            case 'In Consultation':
                return 'status-badge status-consulting';
            case 'Checked-in':
                return 'status-badge';
            case 'Scheduled':
                return 'status-badge';
            default:
                return 'status-badge';
        }
    };

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Checked-in':
                return 'Checked-in';
            case 'Scheduled':
                return 'Scheduled';
            default:
                return status;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Checked-in':
                return { backgroundColor: '#e0e0e0' };
            case 'Scheduled':
                return { backgroundColor: '#e2f3ff' };
            default:
                return {};
        }
    };

    const fetchDashboard = async () => {
        try {
            const data = await getDoctorDashboard();
            setDashboardData({
                doctorName: data.doctorName || '',
                todayAppointments: data.todayAppointments || [],
                waitingQueue: data.waitingQueue || []
            });
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            console.error('Error response:', err.response);
            console.error('Error details:', err.response?.data);
            
            let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại.';
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.';
                } else if (err.response.status === 404) {
                    errorMessage = 'API endpoint không tìm thấy. Vui lòng kiểm tra lại.';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.message) {
                errorMessage = `Lỗi: ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEMR = async (appointmentId) => {
        try {
            // Update status to "In Consultation"
            await startConsultation(appointmentId);
            // Navigate to EMR page
            navigate(`/doctor/emr/${appointmentId}`);
        } catch (err) {
            console.error('Error opening EMR:', err);
            alert('Không thể mở EMR. Vui lòng thử lại.');
        }
    };

    const handleReturnToEMR = (appointmentId) => {
        navigate(`/doctor/emr/${appointmentId}`);
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
            <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                <h2 style={{ color: '#d32f2f', marginBottom: '10px' }}>Lỗi</h2>
                <p style={{ marginBottom: '20px' }}>{error}</p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                    Vui lòng kiểm tra:
                    <br />1. Bạn đã đăng nhập với tài khoản Doctor chưa?
                    <br />2. Backend server đang chạy không? (http://localhost:8080)
                    <br />3. Xem Console (F12) để biết thêm chi tiết lỗi
                </p>
            </div>
        );
    }

    return (
        <div className="doctor-dashboard-container">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                <nav>
                    <ul>
                        <li>
                            <a href="#" className="active">
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
                <h1>Doctor Dashboard (Welcome, Dr. {dashboardData.doctorName}!)</h1>

                <div className="dashboard-layout">
                    <div className="card">
                        <h2>My Patient Queue (Live)</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Patient Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.waitingQueue.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                            Không có bệnh nhân trong hàng chờ
                                        </td>
                                    </tr>
                                ) : (
                                    dashboardData.waitingQueue.map((appointment, index) => {
                                        const isInConsultation = appointment.status === "In Consultation" || 
                                                                  appointment.status === "in consultation";
                                        return (
                                            <tr key={appointment.appointmentID}>
                                                <td>{index + 1}</td>
                                                <td>{appointment.patientName}</td>
                                                <td>
                                                    {isInConsultation ? (
                                                        <span className="status-badge status-consulting">In Consultation</span>
                                                    ) : (
                                                        <span className="status-badge status-waiting">Waiting</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {isInConsultation ? (
                                                        <button 
                                                            className="action-btn"
                                                            onClick={() => handleReturnToEMR(appointment.appointmentID)}
                                                        >
                                                            Working...
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="action-btn"
                                                            onClick={() => handleOpenEMR(appointment.appointmentID)}
                                                        >
                                                            Open EMR
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card">
                        <h2>Today's Appointment Schedule</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Patient Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.todayAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                            Không có lịch hẹn nào trong ngày
                                        </td>
                                    </tr>
                                ) : (
                                    dashboardData.todayAppointments.map((appointment) => (
                                        <tr key={appointment.appointmentID}>
                                            <td>{formatTime(appointment.dateTime)}</td>
                                            <td>{appointment.patientName}</td>
                                            <td>
                                                <span 
                                                    className="status-badge" 
                                                    style={getStatusStyle(appointment.status)}
                                                >
                                                    {getStatusDisplay(appointment.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;

