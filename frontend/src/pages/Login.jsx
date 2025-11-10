import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    // Nếu đã đăng nhập, redirect về trang trước đó hoặc dashboard
    useEffect(() => {
        if (isAuthenticated()) {
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(username, password);
            // Context đã xử lý việc lưu token và user vào localStorage
            // Redirect về trang trước đó hoặc dashboard dựa trên role
            const from = location.state?.from?.pathname;
            
            if (from) {
                navigate(from, { replace: true });
            } else if (response.role === "Doctor") {
                navigate('/doctor/dashboard', { replace: true });
            } else if (response.role === "Receptionist") {
                navigate('/receptionist/dashboard', { replace: true });
            } else if (response.role === "Admin") {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
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