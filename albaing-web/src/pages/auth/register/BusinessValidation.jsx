import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import axios from 'axios';

const BusinessValidation = () => {
    const [licenseNumber, setLicenseNumber] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // ✅ useNavigate 사용

    // 사업자 등록번호 인증하기
    const validateBusinessNumber = () => {
        const data = { "b_no": [licenseNumber] };

        axios({
            url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=0rsV2ZpVVbhRdzdow1XYlJ90OFql0qQm1sn7RnDySfIL6euWd5uVi7XFviZDtCZGB2iykgpDi%2BtccmdqSNmY8g%3D%3D",
            method: "POST",
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
            .then(response => {
                console.log(response.data.data[0]['b_stt_cd']);
                const valid = response.data.data[0]['b_stt_cd'];

                if (valid === '01') {
                    setMessage("validateBusinessNumber axios : 사업자 회원가입이 가능합니다.");
                } else {
                    setMessage("사업자 회원가입을 할 수 없습니다.");
                }
            })
            .catch(error => {
                console.log(error.response ? error.response.data : error.message);
                setMessage("BusinessValidation axios : 에러가 발생했습니다.");
            });
    };

    // 가입하기
    const businessRegistration = () => {
        const data = { "b_no": [licenseNumber] };

        axios({
            url: "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=0rsV2ZpVVbhRdzdow1XYlJ90OFql0qQm1sn7RnDySfIL6euWd5uVi7XFviZDtCZGB2iykgpDi%2BtccmdqSNmY8g%3D%3D",
            method: "POST",
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
            .then(response => {
                console.log("Response Data:", response.data);
                const valid = response.data.data[0]['b_stt_cd'];

                if (valid === '01') {
                    alert("businessRegistration axios : 사업자 인증에 성공했습니다.");
                    navigate('/register/company'); // ✅ useNavigate 사용하여 페이지 이동
                } else {
                    alert("사업자가 아닙니다. 사업자 회원가입을 진행할 수 없습니다.");
                    navigate('/register/BusinessValidation'); // ✅ 다시 인증 페이지로 이동
                }
            })
            .catch(error => {
                console.log("businessRegistration axios Error:", error.response ? error.response.data : error.message);
                alert("businessRegistration axios : 에러가 발생했습니다.");
            });
    };

    return (
        <div>
            <h2>사업자 번호 인증</h2>
            <div>
                <input
                    type="text"
                    id="license"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="사업자 번호를 입력하세요"
                />
                <button onClick={validateBusinessNumber}>인증 확인</button>
            </div>
            {message && <div id="regimessage"><br/>{message}</div>}
            <div>
                <button onClick={businessRegistration}>다음으로</button>
            </div>
        </div>
    );
};

export default BusinessValidation;
