import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginTab() {
    const [tab, setTab] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // axios 인스턴스 생성
    const api = axios.create({
        baseURL: "http://localhost:8080",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const endpoint = tab === "user"
            ? "/api/auth/login/person"
            : "/api/auth/login/company";

        const requestBody = tab === "user"
            ? { userEmail: email, userPassword: password }
            : { companyEmail: email, companyPassword: password };

        console.log("로그인 요청 전송:", endpoint);
        console.log("요청 데이터:", requestBody);

        api.post(endpoint, requestBody)
            .then(response => {
                console.log("로그인 성공:", response.data);

                // 성공 처리
                localStorage.setItem(tab, JSON.stringify(response.data[tab]));

                // 알림 표시
                alert("로그인이 성공적으로 완료되었습니다.");

                // 페이지 이동
                navigate("/");
            })
            .catch(error => {
                console.error("로그인 오류:", error);

                // 상세 에러 처리
                if (error.response) {
                    // 서버에서 응답을 받은 경우 (4xx, 5xx 상태 코드)
                    console.log("서버 응답 데이터:", error.response.data);
                    console.log("서버 응답 상태:", error.response.status);

                    const errorMessage = error.response.data?.message ||
                        `오류 코드: ${error.response.status}`;
                    setError(errorMessage);

                    // 401 Unauthorized 에러 처리
                    if (error.response.status === 401) {
                        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
                    }
                    // 404 Not Found 에러 처리
                    else if (error.response.status === 404) {
                        setError("서버에 연결할 수 없습니다. API 경로를 확인하세요.");
                    }
                    // 500 Internal Server Error 에러 처리
                    else if (error.response.status === 500) {
                        setError("서버 오류가 발생했습니다. 관리자에게 문의하세요.");
                    }
                }
                else if (error.request) {
                    // 요청이 전송되었으나 응답을 받지 못한 경우
                    console.log("응답 없음:", error.request);
                    setError("서버에서 응답이 없습니다. 서버 연결 상태를 확인하세요.");
                }
                else {
                    // 요청 설정 중 오류가 발생한 경우
                    console.log("요청 설정 오류:", error.message);
                    setError("요청 설정 중 오류가 발생했습니다: " + error.message);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
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
                        disabled={isLoading}
                    >
                        개인 로그인
                    </button>
                    <button
                        className={`flex-1 py-2 text-center rounded-t-lg ${
                            tab === "company" ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setTab("company")}
                        disabled={isLoading}
                    >
                        기업 로그인
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg transition ${
                            isLoading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}