import { useState } from "react";
import axios from "axios";

export default function ChangePassword() {
    const [userType, setUserType] = useState("user");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChangePassword = () => { // 프론트에서 테스트 성공
        setMessage("");
        setError("");

        const endpoint =
            userType === "user" ? "/api/auth/update/user/password" : "/api/auth/update/company/password";

        axios.post(endpoint, {
            userEmail: userType === "user" ? email : undefined,
            companyEmail: userType === "company" ? email : undefined,
            userPhone: userType === "user" ? phone : undefined,
            companyPhone: userType === "company" ? phone : undefined,
            newPassword,
        })
            .then(() => {
                setMessage("비밀번호가 성공적으로 변경되었습니다.");
            })
            .catch(() => {
                setError("비밀번호 변경 실패");
            });
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">비밀번호 변경</h2>

            <div className="mb-2">
                <label className="mr-2">회원 유형:</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className="border p-2 rounded">
                    <option value="user">개인회원</option>
                    <option value="company">기업회원</option>
                </select>
            </div>

            <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="text" placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 w-full mb-2" />

            <button onClick={handleChangePassword} className="bg-green-500 text-white p-2 rounded w-full">비밀번호 변경</button>
            {message && <p className="mt-2 text-green-600">{message}</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
    );
}
