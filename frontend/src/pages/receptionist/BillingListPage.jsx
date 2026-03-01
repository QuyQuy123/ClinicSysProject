import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../components/LogoutButton';
import { getPaidBills } from '../../ApiClient/receptionistService';
import './BillingListPage.css';

function BillingListPage() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        const fetchBills = async () => {
            try {
                setLoading(true);
                const data = await getPaidBills();
                setBills(Array.isArray(data) ? data : []);
                setError('');
            } catch (err) {
                console.error('Error fetching paid bills:', err);
                setError('Không thể tải danh sách hóa đơn đã thanh toán.');
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    const filteredBills = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return bills;
        return bills.filter((b) => {
            const invoice = (b.invoiceCode || '').toLowerCase();
            const patientName = (b.patientName || '').toLowerCase();
            const patientCode = (b.patientCode || '').toLowerCase();
            return invoice.includes(q) || patientName.includes(q) || patientCode.includes(q);
        });
    }, [bills, query]);

    const formatMoney = (value) => Number(value || 0).toLocaleString('vi-VN');
    const formatDateTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : 'N/A');

    return (
        <div className="billing-list-page">
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
                <div className="header-row">
                    <div>
                        <h1>Hóa đơn đã thanh toán</h1>
                        <div className="subtitle">Danh sách tất cả hóa đơn có trạng thái Paid</div>
                    </div>
                </div>

                <div className="toolbar">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Tìm theo mã hóa đơn / mã bệnh nhân / tên bệnh nhân..."
                    />
                    <div className="count">{filteredBills.length} hóa đơn</div>
                </div>

                {loading ? (
                    <div className="state">Đang tải...</div>
                ) : error ? (
                    <div className="state error">{error}</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã hóa đơn</th>
                                    <th>Bệnh nhân</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Số tiền</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">Không có hóa đơn</td>
                                    </tr>
                                ) : (
                                    filteredBills.map((b) => (
                                        <tr key={b.billID}>
                                            <td className="mono">{b.invoiceCode || `#${b.billID}`}</td>
                                            <td>
                                                <div className="bold">{b.patientName}</div>
                                                <div className="muted">{b.patientCode}</div>
                                            </td>
                                            <td>{formatDateTime(b.datePaid || b.dateIssued)}</td>
                                            <td className="money">{formatMoney(b.totalAmount)} đ</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link className="link" to={`/receptionist/billing/invoice/${b.billID}`}>
                                                    Xem chi tiết →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BillingListPage;

