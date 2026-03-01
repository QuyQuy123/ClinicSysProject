import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';
import { confirmBillingPayment, getBillingDetails } from '../../ApiClient/receptionistService';
import './BillingPage.css';

function BillingPage() {
    const { appointmentId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                setLoading(true);
                const details = await getBillingDetails(appointmentId);
                if (!isMounted) return;
                setData(details);
                setError('');
            } catch (err) {
                console.error('Error fetching billing details:', err);
                if (!isMounted) return;
                setError('Không thể tải dữ liệu thanh toán. Vui lòng thử lại.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [appointmentId]);

    const formattedTotal = useMemo(() => {
        const total = data?.totalAmount ?? 0;
        const num = typeof total === 'string' ? parseFloat(total) : total;
        if (!num) return '0';
        return Number(num).toLocaleString('vi-VN');
    }, [data?.totalAmount]);

    const isPaid = (data?.paymentStatus || '').trim().toLowerCase() === 'paid';

    const handleConfirmPaid = async () => {
        try {
            setConfirming(true);
            const updated = await confirmBillingPayment(appointmentId);
            setData(updated);
            setSuccess('Đã xác nhận thanh toán.');
            setError('');
        } catch (err) {
            console.error('Error confirming payment:', err);
            setError('Không thể xác nhận thanh toán. Vui lòng thử lại.');
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className="billing-page">
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
                <div className="billing-header">
                    <div className="billing-header-left">
                        <Link className="back-link" to="/receptionist/dashboard">← Quay lại</Link>
                        <h1>Thanh toán</h1>
                        <div className="billing-subtitle">
                            Lịch hẹn #{appointmentId}
                            {data?.patientName ? ` • Bệnh nhân: ${data.patientName}` : ''}
                            {data?.doctorName ? ` • Bác sĩ: ${data.doctorName}` : ''}
                            {isPaid ? ' • Trạng thái: Đã thanh toán' : ''}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="billing-state">Đang tải...</div>
                ) : error ? (
                    <div className="billing-error">
                        <div style={{ marginBottom: 10 }}>{error}</div>
                        <button onClick={() => window.location.reload()} className="retry-btn">Thử lại</button>
                    </div>
                ) : (
                    <>
                        <div className="billing-content">
                            {success ? <div className="billing-success">{success}</div> : null}
                            <div className="billing-left">
                                <div className="qr-card">
                                    <img className="qr-image" src="/QRTech.jpg" alt="QR thanh toán" />
                                    <div className="qr-hint">Quét QR để thanh toán</div>
                                </div>
                            </div>

                            <div className="billing-right">
                                <div className="card">
                                    <h2>Chẩn đoán</h2>
                                    <div className="kv">
                                        <div className="k">Mã ICD10</div>
                                        <div className="v">{data?.diagnosisCode || 'N/A'}</div>
                                    </div>
                                    <div className="kv">
                                        <div className="k">Nội dung</div>
                                        <div className="v">{data?.diagnosisDescription || 'N/A'}</div>
                                    </div>
                                    <div className="kv">
                                        <div className="k">Triệu chứng</div>
                                        <div className="v">{data?.symptoms || 'N/A'}</div>
                                    </div>
                                    <div className="kv">
                                        <div className="k">Ghi chú bác sĩ</div>
                                        <div className="v">{data?.consultationNotes || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-title-row">
                                        <h2>Đơn thuốc</h2>
                                        <div className="billing-actions">
                                            <Link
                                                className="export-btn"
                                                to={`/receptionist/billing/${appointmentId}/print`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Xuất đơn thuốc
                                            </Link>
                                            <div className="total-chip">
                                                Tổng: <strong>{formattedTotal}</strong> đ
                                            </div>
                                        </div>
                                    </div>

                                    {(data?.items?.length || 0) === 0 ? (
                                        <div className="empty">Không có đơn thuốc</div>
                                    ) : (
                                        <div className="table-wrap">
                                            <table className="billing-table">
                                                <thead>
                                                    <tr>
                                                        <th>Thuốc</th>
                                                        <th>Hàm lượng</th>
                                                        <th>Đơn giá</th>
                                                        <th>Số lượng</th>
                                                        <th>Thành tiền</th>
                                                        <th>Ghi chú</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.items.map((item, idx) => (
                                                        <tr key={`${item.medicineID}-${idx}`}>
                                                            <td>
                                                                <div className="med-name">{item.medicineName}</div>
                                                                <div className="muted">{item.medicineCode}</div>
                                                            </td>
                                                            <td>{item.strength || '-'}</td>
                                                            <td>
                                                                {Number(item.unitPrice || 0).toLocaleString('vi-VN')} đ
                                                                {item.unit ? <span className="muted"> / {item.unit}</span> : null}
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{Number(item.lineTotal || 0).toLocaleString('vi-VN')} đ</td>
                                                            <td>{item.note || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="billing-footer-actions">
                            <button
                                className={`confirm-paid-btn ${isPaid ? 'disabled' : ''}`}
                                onClick={handleConfirmPaid}
                                disabled={confirming || isPaid}
                                title={isPaid ? 'Đã thanh toán' : 'Xác nhận đã thanh toán'}
                            >
                                {isPaid ? 'Đã thanh toán' : (confirming ? 'Đang xác nhận...' : 'Xác nhận đã thanh toán')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BillingPage;

