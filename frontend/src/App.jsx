import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

// --- Import các layout và trang mới ---
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import StaffList from './pages/StaffList';
import AddStaff from './pages/AddStaff';
import UpdateStaff from './pages/UpdateStaff';
import ServiceList from './pages/ServiceList';
import AddService from './pages/AddService';
import UpdateService from './pages/UpdateService';
// (Bạn có thể làm tương tự cho Receptionist/Doctor Layout...)

// (Các component placeholder cũ)
function DoctorDashboard() { return <div><h1>Doctor Dashboard</h1></div>; }
function ReceptionistDashboard() { return <div><h1>Receptionist Dashboard</h1></div>; }
// function AdminDashboard() { return <div><h1>Admin Dashboard</h1></div>; } // Đã import
function ForgotPassword() { return <div><h1>Quên mật khẩu</h1></div>; }


export default function App() {
    return (
        <Routes>
            {/* Các route công khai */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- Các Route của Admin (Dùng Layout) --- */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="staff" element={<StaffList />} />
                <Route path="staff/new" element={<AddStaff />} />
                <Route path="staff/edit/:id" element={<UpdateStaff />} />
                <Route path="services" element={<ServiceList />} />
                <Route path="services/new" element={<AddService />} />
                <Route path="services/edit/:id" element={<UpdateService />} />
                {/* (Thêm các route admin khác ở đây) */}
            </Route>

            {/* --- Các Route của Doctor (Tạm thời) --- */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

            {/* --- Các Route của Lễ tân (Tạm thời) --- */}
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />

            {/* Route mặc định */}
            <Route path="/" element={<Login />} />
        </Routes>
    );
}