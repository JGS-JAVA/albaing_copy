import { useState, useEffect } from "react";

const Signup = () => {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setNickname(decodeURIComponent(params.get("nickname") || ""));
        setEmail(params.get("email") || "");
        setBirthday(params.get("birthday") || "");
        setGender(params.get("gender") || "");
        setProfileImage(params.get("profileImage") || "");
    }, []);

    const handleSignup = () => {
        console.log({ nickname, email, birthday, gender, profileImage, password });
        alert("회원가입 요청이 전송되었습니다.");
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white shadow-md rounded-lg">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>

            <label className="block">닉네임</label>
            <input type="text" value={nickname} disabled className="input-field" />

            <label className="block">이메일</label>
            <input type="email" value={email} disabled className="input-field" />

            <label className="block">비밀번호</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
            />

            <label className="block">성별</label>
            <input type="text" value={gender} disabled className="input-field" />

            <label className="block">생일</label>
            <input type="text" value={birthday} disabled className="input-field" />

            <label className="block">프로필 이미지</label>
            {profileImage && <img src={profileImage} alt="프로필 이미지" className="w-24 h-24 rounded-full" />}
            <input
                type="file"
                onChange={(e) => setProfileImage(URL.createObjectURL(e.target.files[0]))}
                className="block mt-2"
            />

            <button onClick={handleSignup} className="btn mt-4">가입하기</button>
        </div>
    );
};

export default Signup;
