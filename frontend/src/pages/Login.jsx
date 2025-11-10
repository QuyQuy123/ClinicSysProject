import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../services/authService';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            localStorage.setItem('clinicSysToken', response.token);
            localStorage.setItem('clinicSysUser', JSON.stringify({
                username: response.username,
                role: response.role
            }));
            if (response.role === "Doctor") {
                navigate('/doctor/dashboard');
            } else if (response.role === "Receptionist") {
                navigate('/receptionist/dashboard');
            } else if (response.role === "Admin") {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
            console.error('Login failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <div className="logo">ClinicSys</div>
                <h2>Đăng nhập Hệ thống</h2>
            </div>

            {}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập / Email</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Nhập email của bạn..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Nhập mật khẩu..."
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="loading"></span> Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </div>

                <div className="forgot-password">
                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;