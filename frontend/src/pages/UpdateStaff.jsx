import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getStaffById, updateStaff, resetPassword } from '../services/userService';
import './StaffForm.css';

function UpdateStaff() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [staff, setStaff] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState('Active');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await getStaffById(parseInt(id));
                setStaff(data);
                setFullName(data.fullName || '');
                setEmail(data.email || '');
                setRoleName(data.roleName || '');
                setStatus(data.status || 'Active');
            } catch (err) {
                setError('Không thể tải thông tin nhân viên. Vui lòng thử lại.');
                console.error('Error fetching staff:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!fullName || !roleName || !status) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setSaving(false);
            return;
        }

        try {
            const roleID = roleName === 'Doctor' ? 2 : roleName === 'Receptionist' ? 3 : null;
            if (!roleID) {
                setError('Role không hợp lệ');
                setSaving(false);
                return;
            }

            await updateStaff(parseInt(id), {
                fullName,
                roleID,
                status
            });
            navigate('/admin/staff');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể cập nhật nhân viên. Vui lòng thử lại.');
            console.error('Error updating staff:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async () => {
        if (!window.confirm('Bạn có chắc muốn reset mật khẩu của nhân viên này về mật khẩu mặc định?')) {
            return;
        }

        try {
            await resetPassword(parseInt(id));
            alert('Mật khẩu đã được reset thành công!');
        } catch (err) {
            alert('Không thể reset mật khẩu. Vui lòng thử lại.');
            console.error('Error resetting password:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (error && !staff) {
        return (
            <div className="staff-form">
                <h1>Update Staff</h1>
                <div className="card">
                    <div className="error-message">{error}</div>
                    <div className="form-actions">
                        <Link to="/admin/staff">
                            <button type="button" className="cancel-btn">Quay lại</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-form">
            <h1>Update Staff</h1>

            <div className="card">
                <h2>Edit Staff Member Details</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">
                            Full Name<span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email (Username)</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            Role<span className="required">*</span>
                        </label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                        >
                            <option value="Doctor">Doctor</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            Phone Number <span className="optional">(Optional)</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">
                            Account Status<span className="required">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="secondary-btn" onClick={handleResetPassword}>
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateStaff;

