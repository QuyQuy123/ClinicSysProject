import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Bảo vệ các route yêu cầu authentication
 * 
 * @param {React.ReactNode} children - Component con cần được bảo vệ
 * @param {string|string[]} requiredRole - Role yêu cầu (optional). Nếu không có, chỉ cần authenticated
 * @param {string} redirectTo - Route redirect nếu không có quyền (default: '/login')
 */
const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const location = useLocation();

    // Đang kiểm tra authentication
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <p>Đang tải...</p>
            </div>
        );
    }

    // Chưa đăng nhập
    if (!isAuthenticated()) {
        // Lưu location hiện tại để redirect lại sau khi login
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Kiểm tra role nếu có yêu cầu
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = roles.some(role => hasRole(role));
        
        if (!hasRequiredRole) {
            // Không có quyền truy cập
            return (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    flexDirection: 'column'
                }}>
                    <h2>403 - Không có quyền truy cập</h2>
                    <p>Bạn không có quyền truy cập trang này.</p>
                </div>
            );
        }
    }

    // Có quyền truy cập
    return <>{children}</>;
};

export default ProtectedRoute;

