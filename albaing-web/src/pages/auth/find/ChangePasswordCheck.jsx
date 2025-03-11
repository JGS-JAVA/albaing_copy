import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChangePasswordCheck() {
    const [userType, setUserType] = useState("user");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleVerification = () => {
        setError("");

        const endpoint = userType === "user"
            ? "/api/auth/verify/user"
            : "/api/auth/verify/company";

        const requestData = userType === "user"
            ? { userEmail: email, userName, userPassword: password }
            : { companyEmail: email, companyPassword: password };

        axios.post(endpoint, requestData)
            .then(() => {
                navigate("/find/changePasswordSet", { state: { email, userType } });
            })
            .catch(() => {
                setError("계정 정보가 일치하지 않습니다.");
            });
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">비밀번호 변경 - 본인 인증</h2>

            <div className="mb-2">
                <label className="mr-2">회원 유형:</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className="border p-2 rounded">
                    <option value="user">개인회원</option>
                    <option value="company">기업회원</option>
                </select>
            </div>

            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full mb-2"
            />

            {userType === "user" && (
                <input
                    type="text"
                    placeholder="이름"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border p-2 w-full mb-2"
                />
            )}

            <input
                type="password"
                placeholder="현재 비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full mb-2"
            />

            <button onClick={handleVerification} className="bg-blue-500 text-white p-2 rounded w-full">
                본인 확인
            </button>

            {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
    );
}
