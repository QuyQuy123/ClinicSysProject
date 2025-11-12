import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAppointmentsByWeek } from '../../ApiClient/receptionistService';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal';
import LogoutButton from '../../components/LogoutButton';
import './AppointmentList.css';

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        // Get Monday of current week
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const monday = new Date(today.setDate(diff));
        return monday;
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [currentWeekStart]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const weekStartStr = formatDateForAPI(currentWeekStart);
            const data = await getAppointmentsByWeek(weekStartStr);
            setAppointments(data || []);
            setError('');
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatDateForAPI = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getWeekDays = () => {
        const days = [];
        const monday = new Date(currentWeekStart);
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const getWeekRange = () => {
        const monday = new Date(currentWeekStart);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        
        const mondayStr = `${monthNames[monday.getMonth()]} ${monday.getDate()}`;
        const sundayStr = `${monthNames[sunday.getMonth()]} ${sunday.getDate()}, ${sunday.getFullYear()}`;
        
        return `${mondayStr} - ${sundayStr}`;
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };

    const handleToday = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        setCurrentWeekStart(monday);
    };

    const getAppointmentsForDay = (day) => {
        return appointments.filter(apt => {
            const aptDate = new Date(apt.dateTime);
            return aptDate.toDateString() === day.toDateString();
        });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    const getStatusClass = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('scheduled')) {
            return 'status-scheduled';
        } else if (statusLower.includes('checked-in') || statusLower.includes('check-in')) {
            return 'status-checked-in';
        } else if (statusLower.includes('confirmed')) {
            return 'status-confirmed';
        }
        return '';
    };

    const handleAppointmentClick = async (appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailsModalOpen(true);
    };

    const handleAppointmentUpdated = () => {
        fetchAppointments();
        setIsDetailsModalOpen(false);
        setSelectedAppointment(null);
    };

    const weekDays = getWeekDays();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="appointment-list-page">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/receptionist/dashboard">
                                <span className="icon">🏠</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/receptionist/patients">
                                <span className="icon">👤</span> Patients
                            </Link>
                        </li>
                        <li>
                            <Link to="/receptionist/appointments" className="active">
                                <span className="icon">📅</span> Appointments
                            </Link>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">👥</span> Patient Queue
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">💳</span> Billing
                            </a>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', padding: '20px' }}>
                    <LogoutButton />
                </div>
            </div>

            <div className="main-content">
                <h1>Appointment Calendar</h1>

                <div className="calendar-controls">
                    <div className="nav-buttons">
                        <button onClick={handlePrevWeek}>&lt; Prev</button>
                        <button onClick={handleToday}>Today</button>
                        <button onClick={handleNextWeek}>Next &gt;</button>
                    </div>
                    <div className="current-date">{getWeekRange()}</div>
                    <div className="view-buttons">
                        <button>Day</button>
                        <button className="active">Week</button>
                        <button>Month</button>
                    </div>
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

                <div className="calendar-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        <table className="calendar-grid">
                            <thead>
                                <tr>
                                    {weekDays.map((day, index) => (
                                        <th key={index}>
                                            {dayNames[index]}<br />
                                            {monthNames[day.getMonth()]} {day.getDate()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {weekDays.map((day, dayIndex) => {
                                        const dayAppointments = getAppointmentsForDay(day);
                                        return (
                                            <td key={dayIndex}>
                                                {dayAppointments.map((appointment) => (
                                                    <div
                                                        key={appointment.appointmentID}
                                                        className={`appointment-block ${getStatusClass(appointment.status)}`}
                                                        onClick={() => handleAppointmentClick(appointment)}
                                                    >
                                                        <span className="time">{formatTime(appointment.dateTime)}</span>
                                                        <span className="patient">{appointment.patientName}</span>
                                                        <span className="doctor">{appointment.doctorName}</span>
                                                    </div>
                                                ))}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <AppointmentDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedAppointment(null);
                }}
                onSuccess={handleAppointmentUpdated}
                appointment={selectedAppointment}
            />
        </div>
    );
}

export default AppointmentList;

