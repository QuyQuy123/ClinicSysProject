import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';

// Layout
import AdminLayout from './components/layout/AdminLayout';
import DoctorLayout from './components/layout/DoctorLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffList from './pages/admin/StaffList';
import AddStaff from './pages/admin/AddStaff';
import UpdateStaff from './pages/admin/UpdateStaff';
import ServiceList from './pages/admin/ServiceList';
import AddService from './pages/admin/AddService';
import UpdateService from './pages/admin/UpdateService';
import MedicineList from './pages/admin/MedicineList';
import AddMedicine from './pages/admin/AddMedicine';
import UpdateMedicine from './pages/admin/UpdateMedicine';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import EMRPage from './pages/doctor/EMRPage';
import NewConsultation from './pages/doctor/NewConsultation';
import UpdateConsultation from './pages/doctor/UpdateConsultation';
import CreatePrescription from './pages/doctor/CreatePrescription';
import UpdatePrescription from './pages/doctor/UpdatePrescription';

// Receptionist pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import PatientList from './pages/receptionist/PatientList';
import AppointmentList from './pages/receptionist/AppointmentList';

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

            {/* --- Các Route của Doctor (Dùng Layout) - Yêu cầu Doctor role --- */}
            <Route 
                path="/doctor" 
                element={
                    <ProtectedRoute requiredRole="Doctor">
                        <DoctorLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="emr/:appointmentId" element={<EMRPage />} />
                <Route path="consultation/:appointmentId" element={<NewConsultation />} />
                <Route path="consultation/:appointmentId/update" element={<UpdateConsultation />} />
                <Route path="prescription/:appointmentId/create" element={<CreatePrescription />} />
                <Route path="prescription/:appointmentId/update" element={<UpdatePrescription />} />
            </Route>

            {/* --- Các Route của Lễ tân (Yêu cầu Receptionist role) --- */}
            <Route 
                path="/receptionist/dashboard" 
                element={
                    <ProtectedRoute requiredRole="Receptionist">
                        <ReceptionistDashboard />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/receptionist/patients" 
                element={
                    <ProtectedRoute requiredRole="Receptionist">
                        <PatientList />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/receptionist/appointments" 
                element={
                    <ProtectedRoute requiredRole="Receptionist">
                        <AppointmentList />
                    </ProtectedRoute>
                } 
            />

            {/* Route mặc định */}
            <Route path="/" element={<Login />} />
        </Routes>
    );
}