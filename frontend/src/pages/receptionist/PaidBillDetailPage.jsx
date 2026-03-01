import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';
import { getPaidBillDetails } from '../../ApiClient/receptionistService';
import './PaidBillDetailPage.css';

function PaidBillDetailPage() {
    const { billId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const details = await getPaidBillDetails(billId);
                setData(details);
                setError('');
            } catch (err) {
                console.error('Error fetching bill details:', err);
                setError('Không thể tải chi tiết hóa đơn.');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [billId]);

    const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');
    const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : 'N/A');
    const formatDate = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A');

    const paidAt = useMemo(
        () => formatDateTime(data?.datePaid || data?.dateIssued),
        [data?.datePaid, data?.dateIssued]
    );

    return (
        <div className="paid-bill-detail-page">
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
                            <Link to="/receptionist/patients">
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
                            <Link to="/receptionist/billing" className="active">
                                <span className="icon">💳</span> Billing
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div style={{ marginTop: 'auto', padding: '20px' }}>
                    <LogoutButton />
                </div>
            </div>

            <div className="main-content">
                <div className="top-row">
                    <Link className="back" to="/receptionist/billing">← Danh sách hóa đơn</Link>
                    {!loading && !error && data?.appointmentID ? (
                        <div className="top-actions">
                            <Link className="btn" to={`/receptionist/billing/${data.appointmentID}`}>Xem trang thanh toán</Link>
                            <Link className="btn primary" to={`/receptionist/billing/${data.appointmentID}/print`} target="_blank" rel="noreferrer">
                                Xuất A4 / In
                            </Link>
                        </div>
                    ) : null}
                </div>

                <h1>Chi tiết hóa đơn</h1>

                {loading ? (
                    <div className="state">Đang tải...</div>
                ) : error ? (
                    <div className="state error">{error}</div>
                ) : (
                    <div className="grid">
                        <div className="card">
                            <div className="card-title">Thông tin hóa đơn</div>
                            <div className="kv">
                                <div className="k">Mã hóa đơn</div>
                                <div className="v mono">{data?.invoiceCode || `#${data?.billID}`}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Trạng thái</div>
                                <div className="v">
                                    <span className="badge">{data?.paymentStatus || 'Paid'}</span>
                                </div>
                            </div>
                            <div className="kv">
                                <div className="k">Thanh toán lúc</div>
                                <div className="v">{paidAt}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Số tiền</div>
                                <div className="v money">{formatMoney(data?.totalAmount)} đ</div>
                            </div>
                            <div className="kv">
                                <div className="k">Bác sĩ</div>
                                <div className="v">{data?.doctorName || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Giờ khám</div>
                                <div className="v">{formatDateTime(data?.appointmentDateTime)}</div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-title">Thông tin bệnh nhân</div>
                            <div className="kv">
                                <div className="k">Mã bệnh nhân</div>
                                <div className="v mono">{data?.patientCode || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Họ tên</div>
                                <div className="v">{data?.patientName || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Ngày sinh</div>
                                <div className="v">{formatDate(data?.patientDateOfBirth)}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Giới tính</div>
                                <div className="v">{data?.patientGender || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">SĐT</div>
                                <div className="v">{data?.patientPhone || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Email</div>
                                <div className="v">{data?.patientEmail || 'N/A'}</div>
                            </div>
                            <div className="kv">
                                <div className="k">Địa chỉ</div>
                                <div className="v">{data?.patientAddress || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaidBillDetailPage;

