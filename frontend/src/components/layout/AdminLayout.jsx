import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/authService';
import './AdminLayout.css';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

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
                            <Link to="#" className={isActive('/admin/services') ? 'active' : ''}>
                                <span className="icon">💼</span> Services
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className={isActive('/admin/medicine') ? 'active' : ''}>
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