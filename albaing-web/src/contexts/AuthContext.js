import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const storedUser = localStorage.getItem('authUser');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);

                // 바로 상태 업데이트
                setUser(parsedUser);
                setLoading(false);

                setTimeout(() => {
                    console.error("사용자 상태 업데이트 확인:", {
                        user: parsedUser,
                        isLoggedIn: !!parsedUser,
                        userType: parsedUser?.type,
                        userData: parsedUser?.data
                    });
                }, 0);

                return Promise.resolve(parsedUser);
            } catch (e) {
                localStorage.removeItem('authUser');
            }
        }

        return axios.get('/api/auth/checkLogin', { withCredentials: true })
            .then(res => {
                if (res.status === 200 && res.data) {
                    let userData;
                    if (res.data.userId) {
                        userData = { type: 'personal', data: res.data };
                    } else if (res.data.companyId) {
                        userData = { type: 'company', data: res.data };
                    }

                    if (userData) {
                        localStorage.setItem('authUser', JSON.stringify(userData));
                        setUser(userData);
                        setLoading(false);
                        return userData;
                    }
                }

                setUser(null);
                setLoading(false);
                return null;
            })
            .catch(error => {
                localStorage.removeItem('authUser');
                setUser(null);
                setLoading(false);
                return null;
            });
    };

    const login = (credentials, userType) => {
        const endpoint = userType === 'personal'
            ? '/api/auth/login/person'
            : '/api/auth/login/company';

        return axios.post(endpoint, credentials, { withCredentials: true })
            .then(res => {
                if (res.data && res.data.status === "success") {
                    const userData = {
                        type: userType,
                        data: userType === 'personal' ? res.data.user : res.data.company
                    };

                    localStorage.setItem('authUser', JSON.stringify(userData));
                    setUser(userData);

                    return { success: true, data: res.data };
                }

                return { success: false, message: res.data?.message || '로그인에 실패했습니다' };
            })
            .catch(error => {
                return {
                    success: false,
                    message: error.response?.data?.message || '로그인 중 오류가 발생했습니다'
                };
            });
    };

    const logout = () => {
        return axios.post('/api/auth/logout', {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem('authUser');
                setUser(null);
                return true;
            })
            .catch(error => {
                localStorage.removeItem('authUser');
                setUser(null);
                return false;
            });
    };

    useEffect(() => {

        // 로컬 스토리지에서 직접 확인하여 로그인 상태 즉시 설정
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setLoading(false);
            } catch (e) {
                checkAuth();
            }
        } else {
            checkAuth();
        }
    }, []);

    const contextValue = {
        user,
        isLoggedIn: !!user,
        userType: user?.type || null,
        userData: user?.data || null,
        loading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};