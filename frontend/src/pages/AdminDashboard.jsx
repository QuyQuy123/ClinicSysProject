import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../ApiClient/dashboardService';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState({
        todayRevenue: 0,
        patientsToday: 0,
        newPatientsThisMonth: 0,
        appointmentsBooked: 0,
        totalStaff: 0,
        totalDoctors: 0,
        totalReceptionists: 0,
        activeStaff: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats({
                    todayRevenue: data.todayRevenue || 0,
                    patientsToday: data.patientsToday || 0,
                    newPatientsThisMonth: data.newPatientsThisMonth || 0,
                    appointmentsBooked: data.appointmentsBooked || 0,
                    totalStaff: data.totalStaff || 0,
                    totalDoctors: data.totalDoctors || 0,
                    totalReceptionists: data.totalReceptionists || 0,
                    activeStaff: data.activeStaff || 0
                });
            } catch (err) {
                setError('Không thể tải thống kê. Vui lòng thử lại.');
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
            </div>
        );
    }

    const formatCurrency = (amount) => {
        const numAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
        return new Intl.NumberFormat('vi-VN').format(numAmount) + ' đ';
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            {/* KPI Widgets */}
            <div className="kpi-widgets">
                <div className="kpi-card">
                    <h3>Today's Revenue</h3>
                    <div className="value">{formatCurrency(stats.todayRevenue)}</div>
                    <span className="change">+5% vs yesterday</span>
                </div>
                <div className="kpi-card">
                    <h3>Patients Today</h3>
                    <div className="value">{stats.patientsToday}</div>
                    <span className="change">+3 patients</span>
                </div>
                <div className="kpi-card">
                    <h3>New Patients (This Month)</h3>
                    <div className="value">{stats.newPatientsThisMonth}</div>
                </div>
                <div className="kpi-card">
                    <h3>Appointments Booked</h3>
                    <div className="value">{stats.appointmentsBooked}</div>
                    <span className="change">for next 7 days</span>
                </div>
            </div>

            {/* Charts Container */}
            <div className="charts-container">
                <div className="card">
                    <h2>Revenue Trend (Last 30 Days)</h2>
                    <div className="chart-placeholder">
                        [Line Chart Showing Revenue]
                    </div>
                </div>
                
                <div className="card">
                    <h2>Top Services (This Month)</h2>
                    <ul className="summary-list">
                        <li>
                            <span className="name">Khám nội tổng quát</span>
                            <span className="figure">150 visits</span>
                        </li>
                        <li>
                            <span className="name">Xét nghiệm máu</span>
                            <span className="figure">98 visits</span>
                        </li>
                        <li>
                            <span className="name">Siêu âm ổ bụng</span>
                            <span className="figure">75 visits</span>
                        </li>
                        <li>
                            <span className="name">Khám chuyên khoa</span>
                            <span className="figure">60 visits</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Staff Statistics Section */}
            <div className="kpi-widgets" style={{ marginTop: '30px' }}>
                <div className="kpi-card">
                    <h3>Total Staff</h3>
                    <div className="value">{stats.totalStaff}</div>
                </div>
                <div className="kpi-card">
                    <h3>Doctors</h3>
                    <div className="value">{stats.totalDoctors}</div>
                </div>
                <div className="kpi-card">
                    <h3>Receptionists</h3>
                    <div className="value">{stats.totalReceptionists}</div>
                </div>
                <div className="kpi-card">
                    <h3>Active Staff</h3>
                    <div className="value">{stats.activeStaff}</div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
