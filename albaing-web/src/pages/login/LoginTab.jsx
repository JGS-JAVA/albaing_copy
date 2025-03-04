import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginTab() {
    const [tab, setTab] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const endpoint =
                tab === "user"
                    ? "http://localhost:8080/api/auth/login/person"
                    : "http://localhost:8080/api/auth/login/company";

            console.log("Sending request to:", endpoint); // 디버깅용 로그 추가

            const requestBody =
                tab === "user"
                    ? { userEmail: email, userPassword: password }
                    : { companyEmail: email, companyPassword: password };

            console.log("Request body:", requestBody); // 디버깅용 로그 추가

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
                credentials: "include",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `${response.status}: ${response.statusText}`);
            }

            const responseData = await response.json();
            alert("로그인이 성공적으로 완료되었습니다.");
            localStorage.setItem(tab, JSON.stringify(responseData[tab]));
            navigate("/");
        } catch (err) {
            console.error("Login error:", err); // 더 자세한 에러 로깅
            setError(err.message || "로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${
                            tab === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setTab("user")}
                    >
                        개인 로그인
                    </button>
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${
                            tab === "company" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
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
