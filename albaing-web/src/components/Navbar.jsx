import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
    const [role, setRole] = useState(localStorage.getItem("role")); // 로그인 상태 확인
    const navigate = useNavigate();

    useEffect(() => {
        // localStorage 값이 변경될 때 role 상태 업데이트
        const handleStorageChange = () => {
            setRole(localStorage.getItem("role"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        axios.post("/api/account/auth/logout", {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem("companyId");
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                setRole(null); // 상태 업데이트
                navigate("/");
            })
            .catch((err) => {
                console.error("로그아웃 실패:", err);
            });
    };

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <div>
                <Link to="/" className="text-xl font-bold text-blue-600">ALBA</Link>
            </div>
            <div className="flex space-x-4">
                <Link to="/jobs" className="text-gray-700 hover:text-blue-500">채용정보</Link>
                <Link to="/companies" className="text-gray-700 hover:text-blue-500">기업정보</Link>
                <Link to="/community" className="text-gray-700 hover:text-blue-500">커뮤니티</Link>

                {role ? (
                    <>
                        {role === "company" ? (
                            <Link to={`/companies/${localStorage.getItem("companyId")}`} className="text-gray-700 hover:text-blue-500">
                                기업 대시보드
                            </Link>
                        ) : (
                            <Link to="/user/dashboard" className="text-gray-700 hover:text-blue-500">
                                마이페이지
                            </Link>
                        )}
                        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-blue-600 hover:underline">로그인</Link>
                        <Link to="/register" className="text-blue-600 hover:underline">회원가입</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
