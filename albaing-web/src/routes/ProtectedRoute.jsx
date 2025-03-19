import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ userTypeRequired }) => {
    const { isLoggedIn, userType, userData, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 로그인 확인
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // 어드민 권한 확인
    if (userTypeRequired === "admin") {
        if (!userData || !userData.userIsAdmin) {
            return <Navigate to="/" replace />;
        }
    }
    // 일반 사용자 타입 확인 (personal/company)
    else if (userTypeRequired && userType !== userTypeRequired) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;