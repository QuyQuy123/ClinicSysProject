import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

// Placeholder components cho các route khác
function DoctorDashboard() {
    return <div><h1>Doctor Dashboard</h1><p>Chào mừng Bác sĩ!</p></div>;
}

function ReceptionistDashboard() {
    return <div><h1>Receptionist Dashboard</h1><p>Chào mừng Lễ tân!</p></div>;
}

function AdminDashboard() {
    return <div><h1>Admin Dashboard</h1><p>Chào mừng Quản trị viên!</p></div>;
}

function ForgotPassword() {
    return <div><h1>Quên mật khẩu</h1><p>Chức năng đang phát triển...</p></div>;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
    );
}
