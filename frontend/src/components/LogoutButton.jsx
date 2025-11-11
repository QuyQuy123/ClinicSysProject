import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LogoutButton.css';

/**
 * Reusable Logout Button Component
 * Handles user logout and navigation to login page
 */
function LogoutButton() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            logout();
            // Clear any location state and navigate to login
            navigate('/login', { replace: true, state: null });
        }
    };

    return (
        <button 
            onClick={handleLogout} 
            className="logout-button"
        >
            <span className="icon">🚪</span> Logout
        </button>
    );
}

export default LogoutButton;

