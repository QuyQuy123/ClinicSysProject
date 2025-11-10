import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // File CSS bạn đã có
import { login } from '../services/authService'; // Import hàm API (sẽ tạo ở bước 2)

function Login() {
    // 1. Dùng useState để lưu trữ username và password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Thêm loading state
    const navigate = useNavigate(); // Hook để điều hướng

    // 2. Hàm xử lý khi nhấn nút Login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn form reload trang
        setError(''); // Xóa lỗi cũ
        setLoading(true); // Bắt đầu loading

        try {
            // 3. Gọi API service
            const response = await login(username, password);

            // 4. Lưu token vào localStorage
            localStorage.setItem('clinicSysToken', response.token);
            localStorage.setItem('clinicSysUser', JSON.stringify({
                username: response.username,
                role: response.role
            }));

            // 5. Điều hướng đến Dashboard (ví dụ)
            // (Bạn có thể thêm logic để chuyển hướng dựa trên 'response.role')
            if (response.role === "Doctor") {
                navigate('/doctor/dashboard');
            } else if (response.role === "Receptionist") {
                navigate('/receptionist/dashboard');
            } else if (response.role === "Admin") {
                navigate('/admin/dashboard');
            } else {
                navigate('/'); // Trang mặc định
            }

        } catch (err) {
            // 6. Hiển thị lỗi
            setError('Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.');
            console.error('Login failed:', err);
        } finally {
            setLoading(false); // Kết thúc loading
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <div className="logo">ClinicSys</div>
                <h2>Đăng nhập Hệ thống</h2>
            </div>

            {/* 7. Hiển thị thông báo lỗi (nếu có) */}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {/* 8. Thay đổi <form> để gọi handleSubmit */}
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