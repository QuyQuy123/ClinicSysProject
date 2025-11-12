import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPatients, searchPatients } from '../../ApiClient/patientService';
import AddPatientModal from '../../components/AddPatientModal';
import ViewPatientDetailsModal from '../../components/ViewPatientDetailsModal';
import EditPatientModal from '../../components/EditPatientModal';
import LogoutButton from '../../components/LogoutButton';
import './PatientList.css';

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await getAllPatients();
            setPatients(data || []);
            setError('');
            setCurrentPage(1); // Reset to first page when fetching new data
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Không thể tải danh sách bệnh nhân. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchPatients();
            return;
        }

        try {
            setLoading(true);
            const data = await searchPatients(searchTerm);
            setPatients(data || []);
            setError('');
            setCurrentPage(1); // Reset to first page when searching
        } catch (err) {
            console.error('Error searching patients:', err);
            setError('Không thể tìm kiếm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatGender = (gender) => {
        if (!gender) return 'N/A';
        // Handle Vietnamese gender values
        if (gender.toLowerCase().includes('nam') || gender.toLowerCase() === 'male') {
            return 'Male';
        }
        if (gender.toLowerCase().includes('nữ') || gender.toLowerCase() === 'female') {
            return 'Female';
        }
        if (gender.toLowerCase().includes('khác') || gender.toLowerCase() === 'other') {
            return 'Other';
        }
        // Return as is if it's already in English
        return gender;
    };

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
        setIsViewModalOpen(true);
    };

    const handleEdit = (patient) => {
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
    };

    const handlePatientCreated = () => {
        fetchPatients();
    };

    const handlePatientUpdated = () => {
        fetchPatients();
        setIsEditModalOpen(false);
        setSelectedPatient(null);
    };

    // Pagination calculations
    const totalPages = Math.ceil(patients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = patients.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top of table
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="patient-list-page">
            <div className="sidebar">
                <div className="logo">ClinicSys</div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/receptionist/dashboard">
                                <span className="icon">🏠</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/receptionist/patients" className="active">
                                <span className="icon">👤</span> Patients
                            </Link>
                        </li>
                        <li>
                            <Link to="/receptionist/appointments">
                                <span className="icon">📅</span> Appointments
                            </Link>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">👥</span> Patient Queue
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <span className="icon">💳</span> Billing
                            </a>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', padding: '20px' }}>
                    <LogoutButton />
                </div>
            </div>

            <div className="main-content">
                <h1>Patient List</h1>

                <div className="card">
                    <h2>Patient Search</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by Name, Phone, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                        />
                        <button onClick={handleSearch}>
                            <span className="icon">🔍</span> Search
                        </button>
                        <button onClick={() => setIsAddModalOpen(true)}>
                            <span className="icon">➕</span> Add New Patient
                        </button>
                    </div>

                    {error && (
                        <div className="error-message" style={{ 
                            color: '#d32f2f', 
                            marginBottom: '15px',
                            padding: '10px',
                            backgroundColor: '#ffebee',
                            borderRadius: '5px'
                        }}>
                            {error}
                        </div>
                    )}

                    <h2>All Patients</h2>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Full Name</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            Không có bệnh nhân nào
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedPatients.map((patient) => (
                                        <tr key={patient.patientID}>
                                            <td>{patient.patientCode}</td>
                                            <td>{patient.fullName}</td>
                                            <td>{formatDate(patient.dateOfBirth)}</td>
                                            <td>{formatGender(patient.gender)}</td>
                                            <td>{patient.address || 'N/A'}</td>
                                            <td>{patient.phone}</td>
                                            <td>{patient.email || 'N/A'}</td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="view-btn"
                                                    onClick={() => handleViewDetails(patient)}
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(patient)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {!loading && patients.length > 0 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            
                            <div className="pagination-numbers">
                                {getPageNumbers().map((page) => (
                                    <button
                                        key={page}
                                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            
                            <button
                                className="pagination-btn"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                            
                            <div className="pagination-info">
                                Trang {currentPage} / {totalPages} ({patients.length} bệnh nhân)
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddPatientModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handlePatientCreated}
            />

            <ViewPatientDetailsModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedPatient(null);
                }}
                patient={selectedPatient}
            />

            <EditPatientModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPatient(null);
                }}
                onSuccess={handlePatientUpdated}
                patient={selectedPatient}
            />
        </div>
    );
}

export default PatientList;

