import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="admin-layout">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                {user && (
                    <div className="user-info" style={{ padding: '15px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>
                            {user.username}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '5px' }}>
                            {user.role}
                        </div>
                    </div>
                )}
                <nav>
                    <ul>
                        <li>
                            <Link 
                                to="/admin/dashboard" 
                                className={isActive('/admin/dashboard') ? 'active' : ''}
                            >
                                <span className="icon">🏠</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/staff" 
                                className={isActive('/admin/staff') ? 'active' : ''}
                            >
                                <span className="icon">👨‍⚕️</span> Staff Management
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/services" className={isActive('/admin/services') ? 'active' : ''}>
                                <span className="icon">💼</span> Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/medicines" className={isActive('/admin/medicines') ? 'active' : ''}>
                                <span className="icon">💊</span> Medicine
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className={isActive('/admin/reports') ? 'active' : ''}>
                                <span className="icon">📊</span> Reports
                            </Link>
                        </li>
                    </ul>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;