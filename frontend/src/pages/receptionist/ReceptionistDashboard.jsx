import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReceptionistDashboard } from '../../ApiClient/receptionistService';
import LogoutButton from '../../components/LogoutButton';
import AddPatientModal from '../../components/AddPatientModal';
import BookAppointmentModal from '../../components/BookAppointmentModal';
import './ReceptionistDashboard.css';

function ReceptionistDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        appointmentsToday: 0,
        totalSlotsToday: 0,
        patientsCheckedIn: 0,
        patientsWaiting: 0,
        estimatedRevenue: 0,
        todayAppointments: [],
        liveQueue: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboard();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
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

    const formatCurrency = (amount) => {
        if (!amount) return '0';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString('vi-VN');
    };

    const getStatusClass = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('scheduled')) {
            return 'status status-scheduled';
        } else if (statusLower.includes('checked-in') || statusLower.includes('check-in')) {
            return 'status status-confirmed';
        } else if (statusLower.includes('in consultation')) {
            return 'status status-in-consultation';
        } else if (statusLower.includes('paid')) {
            return 'status status-paid';
        } else if (statusLower.includes('completed')) {
            return 'status status-ready-billing';
        } else if (statusLower.includes('waiting')) {
            return 'status status-waiting';
        } else if (statusLower.includes('ready for billing')) {
            return 'status status-ready-billing';
        }
        return 'status status-scheduled';
    };

    const getStatusDisplay = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('scheduled')) {
            return 'Scheduled';
        } else if (statusLower.includes('checked-in') || statusLower.includes('check-in')) {
            return 'Checked-in';
        } else if (statusLower.includes('in consultation')) {
            return 'In Consultation';
        } else if (statusLower.includes('paid')) {
            return 'Đã thanh toán';
        } else if (statusLower.includes('completed')) {
            return 'Completed';
        } else if (statusLower.includes('waiting')) {
            return 'Waiting';
        } else if (statusLower.includes('ready for billing')) {
            return 'Ready for Billing';
        }
        return status || 'Unknown';
    };

    const isBillableStatus = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('paid')) return false;
        return statusLower.includes('completed') || statusLower.includes('ready for billing');
    };

    const goToBilling = (appointmentID) => {
        navigate(`/receptionist/billing/${appointmentID}`);
    };

    const fetchDashboard = async () => {
        try {
            const data = await getReceptionistDashboard();
            setDashboardData({
                appointmentsToday: data.appointmentsToday || 0,
                totalSlotsToday: data.totalSlotsToday || 0,
                patientsCheckedIn: data.patientsCheckedIn || 0,
                patientsWaiting: data.patientsWaiting || 0,
                estimatedRevenue: data.estimatedRevenue || 0,
                todayAppointments: data.todayAppointments || [],
                liveQueue: data.liveQueue || []
            });
            setError('');
        } catch (err) {
            console.error('Error fetching dashboard:', err);
            let errorMessage = 'Không thể tải dữ liệu. Vui lòng thử lại.';
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.';
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

    if (loading) {
        return (
            <div className="loading-container" style={{ padding: '20px', textAlign: 'center' }}>
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{ padding: '20px', textAlign: 'center' }}>
                <h2 style={{ color: '#d32f2f', marginBottom: '10px' }}>Lỗi</h2>
                <p style={{ marginBottom: '20px' }}>{error}</p>
                <button onClick={fetchDashboard} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="receptionist-dashboard">
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
                            <a href="/receptionist/patients">
                                <span className="icon">👤</span> Patients
                            </a>
                        </li>
                        <li>
                            <a href="/receptionist/appointments">
                                <span className="icon">📅</span> Appointments
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">👥</span> Patient Queue
                            </a>
                        </li>
                        <li>
                            <Link to="/receptionist/billing">
                                <span className="icon">💳</span> Billing
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', padding: '20px' }}>
                    <LogoutButton />
                </div>
            </div>

            <div className="main-content">
                <h1>Receptionist Dashboard</h1>

                <div className="widgets-container">
                    <div className="widget">
                        <h3>Appointments Today</h3>
                        <div className="value">
                            {dashboardData.appointmentsToday} / {dashboardData.totalSlotsToday}
                        </div>
                    </div>
                    <div className="widget">
                        <h3>Patients Checked-in</h3>
                        <div className="value">{dashboardData.patientsCheckedIn}</div>
                    </div>
                    <div className="widget">
                        <h3>Patients Waiting</h3>
                        <div className="value">{dashboardData.patientsWaiting}</div>
                    </div>
                    <div className="widget">
                        <h3>Estimated Revenue</h3>
                        <div className="value">{formatCurrency(dashboardData.estimatedRevenue)}</div>
                    </div>
                </div>

                <div className="quick-actions">
                    <button onClick={() => setIsBookAppointmentModalOpen(true)}>
                        <span className="icon">➕</span> Book Appointment
                    </button>
                    <button onClick={() => setIsAddPatientModalOpen(true)}>
                        <span className="icon">👤</span> Register Patient
                    </button>
                    <button>
                        <span className="icon">🔍</span> Search Patient
                    </button>
                </div>

                <div className="data-section">
                    <h2>Today's Appointments</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Patient Name</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.todayAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không có lịch hẹn nào trong ngày
                                    </td>
                                </tr>
                            ) : (
                                dashboardData.todayAppointments.map((appointment) => (
                                    <tr key={appointment.appointmentID}>
                                        <td>{formatTime(appointment.dateTime)}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>
                                            <span className={getStatusClass(appointment.status)}>
                                                {getStatusDisplay(appointment.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {isBillableStatus(appointment.status) ? (
                                                <button
                                                    onClick={() => goToBilling(appointment.appointmentID)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        border: '0',
                                                        background: '#2e7d32',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Thanh toán
                                                </button>
                                            ) : (
                                                <span style={{ color: '#98a2b3' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="data-section">
                    <h2>Live Patient Queue</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient Name</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.liveQueue.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                        Không có bệnh nhân trong hàng chờ
                                    </td>
                                </tr>
                            ) : (
                                dashboardData.liveQueue.map((appointment, index) => (
                                    <tr key={appointment.appointmentID}>
                                        <td>{index + 1}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>
                                            <span className={getStatusClass(appointment.status)}>
                                                {getStatusDisplay(appointment.status)}
                                            </span>
                                        </td>
                                        <td>
                                            {isBillableStatus(appointment.status) ? (
                                                <button
                                                    onClick={() => goToBilling(appointment.appointmentID)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '8px',
                                                        border: '0',
                                                        background: '#2e7d32',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontWeight: 600
                                                    }}
                                                >
                                                    Thanh toán
                                                </button>
                                            ) : (
                                                <span style={{ color: '#98a2b3' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddPatientModal
                isOpen={isAddPatientModalOpen}
                onClose={() => setIsAddPatientModalOpen(false)}
                onSuccess={() => {
                    // Refresh dashboard after successful patient creation
                    fetchDashboard();
                }}
            />

            <BookAppointmentModal
                isOpen={isBookAppointmentModalOpen}
                onClose={() => setIsBookAppointmentModalOpen(false)}
                onSuccess={() => {
                    // Refresh dashboard after successful appointment creation
                    fetchDashboard();
                }}
            />
        </div>
    );
}

export default ReceptionistDashboard;

