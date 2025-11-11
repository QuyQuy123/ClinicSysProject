import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutButton from '../LogoutButton';
import './DoctorLayout.css';

function DoctorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="doctor-layout">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                <nav>
                    <ul>
                        <li>
                            <Link 
                                to="/doctor/dashboard" 
                                className={isActive('/doctor/dashboard') ? 'active' : ''}
                            >
                                <span className="icon">🏠</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                <span className="icon">👥</span> Patient Queue
                            </a>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', padding: '20px' }}>
                    <LogoutButton />
                </div>
            </div>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default DoctorLayout;

