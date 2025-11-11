import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import StaffList from './pages/StaffList';
import AddStaff from './pages/AddStaff';
import UpdateStaff from './pages/UpdateStaff';
import ServiceList from './pages/ServiceList';
import AddService from './pages/AddService';
import UpdateService from './pages/UpdateService';
import MedicineList from './pages/MedicineList';
import AddMedicine from './pages/AddMedicine';
import UpdateMedicine from './pages/UpdateMedicine';
import DoctorDashboard from './pages/DoctorDashboard';
import EMRPage from './pages/EMRPage';
import NewConsultation from './pages/NewConsultation';
import UpdateConsultation from './pages/UpdateConsultation';
import UpdatePrescription from './pages/UpdatePrescription';

function ReceptionistDashboard() { return <div><h1>Receptionist Dashboard</h1></div>; }
function ForgotPassword() { return <div><h1>Quên mật khẩu</h1></div>; }


export default function App() {
    return (
        <Routes>
            {/* Các route công khai */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- Các Route của Admin (Dùng Layout) - Yêu cầu Admin role --- */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute requiredRole="Admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="staff" element={<StaffList />} />
                <Route path="staff/new" element={<AddStaff />} />
                <Route path="staff/edit/:id" element={<UpdateStaff />} />
                <Route path="services" element={<ServiceList />} />
                <Route path="services/new" element={<AddService />} />
                <Route path="services/edit/:id" element={<UpdateService />} />
                <Route path="medicines" element={<MedicineList />} />
                <Route path="medicines/new" element={<AddMedicine />} />
                <Route path="medicines/edit/:id" element={<UpdateMedicine />} />
                {/* (Thêm các route admin khác ở đây) */}
            </Route>

            {/* --- Các Route của Doctor (Yêu cầu Doctor role) --- */}
            <Route 
                path="/doctor/dashboard" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <DoctorDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/doctor/emr/:appointmentId" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <EMRPage />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/doctor/consultation/:appointmentId" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <NewConsultation />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/doctor/consultation/:appointmentId/update" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <UpdateConsultation />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/doctor/prescription/:appointmentId/update" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <UpdatePrescription />
                    </ProtectedRoute>
                } 
            />

            {/* --- Các Route của Lễ tân (Yêu cầu Receptionist role) --- */}
            <Route 
                path="/receptionist/dashboard" 
                element={
                    <ProtectedRoute requiredRole="Receptionist">
                        <ReceptionistDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Route mặc định */}
            <Route path="/" element={<Login />} />
        </Routes>
    );
}