import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [tab, setTab] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");

        const endpoint = tab === "user"
            ? "/api/account/auth/login-person"
            : "/api/account/auth/login-company";

        const requestBody = tab === "user"
            ? { userEmail: email, userPassword: password }
            : { companyEmail: email, companyPassword: password };

        console.log("요청 엔드포인트:", endpoint);
        console.log("요청 본문:", requestBody);

        axios.post(endpoint, requestBody, { withCredentials: true })
            .then((response) => {
                console.log("로그인 성공:", response.data);

                if (tab === "company" && response.data.company && response.data.company.companyId) {
                    const { companyId } = response.data.company;
                    localStorage.setItem("companyId", companyId);
                    localStorage.setItem("role", "company");
                    navigate(`/companies/${companyId}`);
                } else if (tab === "user" && response.data.user && response.data.user.userId) {
                    localStorage.setItem("userId", response.data.user.userId);
                    localStorage.setItem("role", "user");
                    navigate("/user/dashboard");
                } else {
                    setError("로그인 정보가 올바르지 않습니다.");
                }
            })
            .catch((err) => {
                console.error("로그인 오류:", err);
                setError(err.response?.data?.message || "로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
            });
    };

    const handleLogout = () => {
        axios.post('/api/account/auth/logout', {}, { withCredentials: true })
            .then(() => {
                localStorage.removeItem('companyId');
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                navigate('/');
            })
            .catch((err) => {
                console.error("Logout failed:", err);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${tab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTab("user")}
                    >
                        개인 로그인
                    </button>
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${tab === "company" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setTab("company")}
                    >
                        기업 로그인
                    </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
}
