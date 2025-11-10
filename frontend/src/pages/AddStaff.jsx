import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStaff } from '../services/userService';
import './StaffForm.css';

function AddStaff() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [roleName, setRoleName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!fullName || !email || !roleName) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc');
            setLoading(false);
            return;
        }

        try {
            await createStaff({ fullName, email, roleName });
            navigate('/admin/staff');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không thể tạo nhân viên. Vui lòng thử lại.');
            console.error('Error creating staff:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-form">
            <h1>Add New Staff</h1>

            <div className="card">
                <h2>New Staff Member Details</h2>
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
                            placeholder="Enter staff's full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email (for Login)<span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="Enter login email (e.g., staff@clinicsys.com)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            <option value="" disabled>-- Select a Role --</option>
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
                            placeholder="Enter contact phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Staff'}
                        </button>
                        <Link to="/admin/staff">
                            <button type="button" className="cancel-btn">
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddStaff;
