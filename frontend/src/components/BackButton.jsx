import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

/**
 * Reusable Back Button Component
 * Navigates to previous page in browser history
 */
function BackButton() {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(-1)} 
            className="back-button"
        >
            ← Back
        </button>
    );
}

export default BackButton;

