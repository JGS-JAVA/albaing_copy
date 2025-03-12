import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChangePasswordSet() {
    const location = useLocation();
    const navigate = useNavigate();
    const { email, userType } = location.state || {};

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        const endpoint = userType === "user" ? "/api/auth/update/user/password" : "/api/auth/update/company/password";
        const requestData = {
            ...(userType === "user" ? { userEmail: email } : { companyEmail: email }),
            newPassword,
        };

        console.log("🔹 Sending password update request:", requestData);

        axios.post(endpoint, requestData)
            .then(() => {
                setMessage("비밀번호가 성공적으로 변경되었습니다.");
                setTimeout(() => navigate("/login"), 2000);
            })
            .catch((error) => {
                console.error("❌ Password update error:", error);
                setError("비밀번호 변경 실패");
            });
    };



    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">새 비밀번호 설정</h2>

            <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="password" placeholder="새 비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border p-2 w-full mb-2" />

            <button onClick={handleChangePassword} className="bg-green-500 text-white p-2 rounded w-full">비밀번호 변경</button>
            {message && <p className="mt-2 text-green-600">{message}</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
    );
}
