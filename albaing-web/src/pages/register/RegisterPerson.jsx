import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPerson = () => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userBirthdate, setUserBirthdate] = useState("");
    const [userGender, setUserGender] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userProfileImage, setUserProfileImage] = useState("");
    const [userTermsAgreement, setUserTermsAgreement] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const nameParam = params.get("name");
        const nicknameParam = params.get("nickname");
        setUserName(decodeURIComponent(nameParam || nicknameParam || ""));

        setUserEmail(params.get("email") || "");

        const birthdayParam = params.get("birthday");
        if (birthdayParam) {
            if (birthdayParam.length === 5) {
                const currentYear = new Date().getFullYear();
                setUserBirthdate(`${currentYear}-${birthdayParam.replace("-", "-")}`);
            } else {
                setUserBirthdate(birthdayParam);
            }
        }

        const genderParam = params.get("gender");
        if (genderParam) {
            setUserGender(genderParam === "M" ? "male" : genderParam === "F" ? "female" : genderParam);
        }

        const profileImageParam = params.get("profileImage") || params.get("profileImg");
        if (profileImageParam) {
            setUserProfileImage(decodeURIComponent(profileImageParam));
        }

        if (params.get("email")) {
            setEmailVerified(true);
        }
    }, []);

    const requestVerificationCode = () => {
        axios.post("/api/auth/sendCode", {
            email: userEmail
        })
            .then(response => {
                alert("인증번호가 이메일로 발송되었습니다.");
            })
            .catch(error => {
                alert(`인증번호 발송 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`);
                console.error("인증번호 발송 오류:", error);
            });
    };

    const verifyCode = () => {
        axios.post("/api/auth/checkCode", {
            email: userEmail,
            code: verificationCode
        })
            .then(response => {
                setEmailVerified(true);
                alert("이메일 인증이 완료되었습니다.");
            })
            .catch(error => {
                alert(`인증번호 확인 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`);
                console.error("인증번호 확인 오류:", error);
            });
    };

    const validateInputs = () => {
        if (!userEmail) {
            alert("이메일을 입력해주세요.");
            return false;
        }

        if (!emailVerified) {
            alert("이메일 인증을 완료해주세요.");
            return false;
        }

        if (!userPassword) {
            alert("비밀번호를 입력해주세요.");
            return false;
        }

        if (userPassword !== confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return false;
        }

        if (!userName) {
            alert("이름을 입력해주세요.");
            return false;
        }

        if (!userPhone) {
            alert("전화번호를 입력해주세요.");
            return false;
        }

        if (!userTermsAgreement) {
            alert("이용약관에 동의해주세요.");
            return false;
        }

        return true;
    };

    const handleSignup = () => {
        if (!validateInputs()) {
            return;
        }

        axios.post("/api/auth/register/person", {
            userEmail,
            userPassword,
            userName,
            userBirthdate: userBirthdate ? new Date(userBirthdate) : null,
            userGender,
            userPhone,
            userAddress,
            userProfileImage,
            userTermsAgreement
        })
            .then(response => {
                alert("회원가입이 성공적으로 완료되었습니다.");
                navigate("/login");
            })
            .catch(error => {
                alert(`회원가입 실패: ${error.response?.data?.message || "알 수 없는 오류가 발생했습니다."}`);
                console.error("회원가입 실패:", error);
            });
    };

    return (
        <div className="container mx-auto p-4 max-w-md bg-white shadow-md rounded-lg">
            <h1 className="text-xl font-bold mb-4">회원가입</h1>

            <div className="mb-4">
                <label className="block mb-1">이메일 *</label>
                <div className="flex">
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        disabled={emailVerified}
                        className="flex-grow p-2 border rounded mr-2"
                        required
                    />
                    {!emailVerified && (
                        <button
                            onClick={requestVerificationCode}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            인증번호 발송
                        </button>
                    )}
                </div>
            </div>

            {!emailVerified && userEmail && (
                <div className="mb-4">
                    <label className="block mb-1">인증번호</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="flex-grow p-2 border rounded mr-2"
                        />
                        <button
                            onClick={verifyCode}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            인증 확인
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-1">비밀번호 *</label>
                <input
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="최소 8자, 숫자와 특수문자 포함"
                />
                <p className="text-xs text-gray-500 mt-1">비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다.</p>
            </div>

            <div className="mb-4">
                <label className="block mb-1">비밀번호 확인 *</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">이름 *</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">생년월일</label>
                <input
                    type="date"
                    value={userBirthdate}
                    onChange={(e) => setUserBirthdate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">성별</label>
                <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">선택</option>
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block mb-1">전화번호 *</label>
                <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    placeholder="예: 010-1234-5678"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">주소</label>
                <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">프로필 이미지</label>
                {userProfileImage && (
                    <img
                        src={userProfileImage}
                        alt="프로필 이미지"
                        className="w-24 h-24 rounded-full mb-2"
                    />
                )}
                <input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setUserProfileImage(URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                    className="block w-full"
                />
            </div>

            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={userTermsAgreement}
                        onChange={(e) => setUserTermsAgreement(e.target.checked)}
                        className="mr-2"
                        required
                    />
                    <span>이용약관에 동의합니다 *</span>
                </label>
            </div>

            <button
                onClick={handleSignup}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                가입하기
            </button>
        </div>
    );
};

export default RegisterPerson;