import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBillingDetails } from '../../ApiClient/receptionistService';
import './BillingPrintPage.css';

function BillingPrintPage() {
    const { appointmentId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                setError('Không thể tải dữ liệu để xuất đơn.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [appointmentId]);

    const formatMoney = (value) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return Number(num || 0).toLocaleString('vi-VN');
    };

    const totalPaid = useMemo(() => formatMoney(data?.totalAmount ?? 0), [data?.totalAmount]);

    return (
        <div className="print-root">
            <div className="print-toolbar no-print">
                <Link className="btn" to={`/receptionist/billing/${appointmentId}`}>← Quay lại thanh toán</Link>
                <button className="btn primary" onClick={() => window.print()}>In / Lưu PDF</button>
            </div>

            {loading ? (
                <div className="print-state">Đang tải...</div>
            ) : error ? (
                <div className="print-state error">{error}</div>
            ) : (
                <div className="a4">
                    <div className="doc-header">
                        <div>
                            <div className="brand">ClinicSys</div>
                            <div className="muted">Phiếu khám & đơn thuốc</div>
                        </div>
                        <div className="doc-meta">
                            <div><span className="k">Mã lịch hẹn:</span> <span className="v">#{appointmentId}</span></div>
                            <div><span className="k">Bệnh nhân:</span> <span className="v">{data?.patientName || 'N/A'}</span></div>
                            <div><span className="k">Bác sĩ:</span> <span className="v">{data?.doctorName || 'N/A'}</span></div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-title">Chuẩn đoán</div>
                        <div className="grid">
                            <div className="row">
                                <div className="k">ICD10</div>
                                <div className="v">{data?.diagnosisCode || 'N/A'}</div>
                            </div>
                            <div className="row">
                                <div className="k">Nội dung</div>
                                <div className="v">{data?.diagnosisDescription || 'N/A'}</div>
                            </div>
                            <div className="row">
                                <div className="k">Triệu chứng</div>
                                <div className="v">{data?.symptoms || 'N/A'}</div>
                            </div>
                            <div className="row">
                                <div className="k">Ghi chú</div>
                                <div className="v">{data?.consultationNotes || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="section">
                        <div className="section-title">Đơn thuốc</div>
                        {(data?.items?.length || 0) === 0 ? (
                            <div className="muted">Không có đơn thuốc</div>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>Thuốc</th>
                                        <th style={{ width: '14%' }}>Hàm lượng</th>
                                        <th style={{ width: '14%' }}>Đơn giá</th>
                                        <th style={{ width: '10%' }}>SL</th>
                                        <th style={{ width: '14%' }}>Thành tiền</th>
                                        <th style={{ width: '8%' }}>Ghi chú</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, idx) => (
                                        <tr key={`${item.medicineID}-${idx}`}>
                                            <td>
                                                <div className="bold">{item.medicineName}</div>
                                                <div className="muted">{item.medicineCode}</div>
                                            </td>
                                            <td>{item.strength || '-'}</td>
                                            <td>{formatMoney(item.unitPrice)} đ</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatMoney(item.lineTotal)} đ</td>
                                            <td>{item.note || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="totals">
                        <div className="total-line">
                            <span className="k">Tổng số tiền đã thanh toán</span>
                            <span className="v">{totalPaid} đ</span>
                        </div>
                    </div>

                    <div className="doc-footer">
                        <div className="muted">Ký tên bác sĩ</div>
                        <div className="sign-line" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default BillingPrintPage;

