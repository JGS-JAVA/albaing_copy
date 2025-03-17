import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiMyPageService from "../../../service/apiMyPageService";
import defaultProfileImage from "../mypage/default-profile.png"// 기본 프로필 이미지
import {useModal,AlertModal} from "../../../components";
import axios from "axios";

const EditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const alertModal = useModal();

    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);

    // 사용자 정보 상태
    const [user, setUserData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        userPhone: "",
        userGender: "",
        userBirthdate: "",
        userAddress: "",
        userProfileImage: ""
    });


    useEffect(() => {
        axios.get(`/api/user/${userId}`)
            .then((res)=>{
                setUserData({
                    userEmail: res.data.userEmail || "",
                    userPassword: res.data.userPassword || "",
                    userName: res.data.userName || "",
                    userPhone: res.data.userPhone || "",
                    userGender: res.data.userGender || "",
                    userBirthdate: res.data.userBirthdate || "",
                    userAddress:res.data.userAddress || "",
                    userProfileImage:res.data.userProfileImage || ""
                });
                setLoading(false);
            })
            .catch(()=>{
                alert("사용자 정보를 불러오는데 실패했습니다.");
                setLoading(false);
            })
    }, [userId]);

    const handleChange = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        formDataToSend.append('user', new Blob([JSON.stringify({
            userEmail: user.userEmail,
            userPassword: user.userPassword,
            userName: user.userName,
            userPhone: user.userPhone,
            userGender: user.userGender,
            userBirthdate: user.userBirthdate,
            userAddress: user.userAddress,
            userProfileImage: user.userProfileImage
        })], {type: 'application/json'}));

        if (profileImage) {
            formDataToSend.append('profileImage', profileImage);
        }

        axios.put(`/api/user/update/${userId}`, formDataToSend, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                alert('사용자 정보가 성공적으로 수정되었습니다!');
                setUserData(res.data);
                navigate(-1);
            })
            .catch((error) => {
                alert(error.response?.data || "회사의 정보를 수정하는 데 실패했습니다.");
            });


    };

    // 프로필 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 제한 (예: 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB를 초과할 수 없습니다.");
                return;
            }

            // 파일 유형 제한
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert("지원되는 이미지 형식은 JPEG, PNG, GIF입니다.");
                return;
            }

            profileImage(file);
            setProfileImage(URL.createObjectURL(file));
        }
    };


    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-[#0066FF] text-center">내 정보 수정</h1>

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={user.userProfileImage ? URL.createObjectURL(user.userProfileImage) : defaultProfileImage}
                    alt="프로필 이미지"
                    className="w-32 h-32 rounded-full border border-gray-300 object-cover mb-3"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="text-sm text-gray-600"
                />
            </div>

            {/* 이름 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">이름</label>
                <input
                    type="text"
                    name="userName"
                    value={user.userName}
                    onChange={handleChange}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-[#A0A0A0] cursor-not-allowed"
                />
            </div>

            {/* 이메일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">이메일</label>
                <input
                    type="email"
                    name="userEmail"
                    value={user.userEmail}
                    onChange={handleChange}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-[#A0A0A0] cursor-not-allowed"
                />
            </div>

            {/* 전화번호 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">전화번호</label>
                <input
                    type="text"
                    name="userPhone"
                    value={user.userPhone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                />
            </div>

            {/* 성별 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">성별</label>
                <select
                    name="userGender"
                    value={user.userGender}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                >
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                    <option value="OTHER">기타</option>
                </select>
            </div>

            {/* 생년월일 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">생년월일</label>
                <input
                    type="date"
                    name="userBirthdate"
                    value={user.userBirthdate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                />
            </div>

            {/* 주소 */}
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#0066FF]">주소</label>
                <input
                    type="text"
                    name="userAddress"
                    value={user.userAddress}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded bg-[#F2F8FF] text-black"
                />
            </div>

            {/* 수정 버튼 */}
            <div className="text-center mt-6">
                <button
                    onClick={handleChange}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    수정 완료
                </button>
            </div>
            {/* 알림 모달 */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={alertModal.closeModal}
                title={alertModal.modalProps.title || '알림'}
                message={alertModal.modalProps.message}
                confirmText="확인"
                type={alertModal.modalProps.type || 'info'}
            />
        </div>
    );
};

export default EditUserPage;
