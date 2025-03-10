import { useState } from "react";

export default function FindId() {
    const [userType, setUserType] = useState("user"); // "user" 또는 "company"
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleFindId = async () => {
        setError("");
        setEmail("");

        const endpoint =
            userType === "user"
                ? `/api/auth/find/user/id?userName=${name}&userPhone=${phone}`
                : `/api/auth/find/company/id?companyName=${name}&companyPhone=${phone}`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("정보를 찾을 수 없습니다.");
            }
            const data = await response.json();
            setEmail(data.email || "찾은 이메일 없음");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">아이디 찾기</h2>

            <div className="mb-2">
                <label className="mr-2">회원 유형:</label>
                <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="user">개인회원</option>
                    <option value="company">기업회원</option>
                </select>
            </div>

            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <input
                type="text"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-2 w-full mb-2"
            />

            <button
                onClick={handleFindId}
                className="bg-blue-500 text-white p-2 rounded w-full"
            >
                아이디 찾기
            </button>

            {email && <p className="mt-2 text-green-600">이메일: {email}</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
        </div>
    );
}
