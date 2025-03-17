import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertModal } from "../../../components";
import {useModal} from "../../../components";

const BusinessValidation = () => {
    const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
    const [companyOwnerName, setCompanyOwnerName] = useState('');
    const [companyOpenDate, setCompanyOpenDate] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const alertModal = useModal();

    // 사업자 등록번호 인증
    const validateBusinessNumber = (callback) => {
        if (!companyRegistrationNumber || !companyOpenDate || !companyOwnerName) {
            alertModal.openModal({
                title: '입력 오류',
                message: '모든 필드를 입력해주세요.',
                type: 'warning'
            });
            return;
        }

        setLoading(true);

        const data = {
            "businesses": [
                {
                    "b_no": companyRegistrationNumber,
                    "start_dt": companyOpenDate,
                    "p_nm": companyOwnerName
                }
            ]
        };

        axios.post(
            "https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=0rsV2ZpVVbhRdzdow1XYlJ90OFql0qQm1sn7RnDySfIL6euWd5uVi7XFviZDtCZGB2iykgpDi%2BtccmdqSNmY8g%3D%3D",
            data,
            { headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } }
        )
            .then(response => {
                const valid = response.data.data[0]['valid'];

                if (valid === '01') {
                    callback(true);
                } else {
                    alertModal.openModal({
                        title: '인증 실패',
                        message: '사업자 정보가 일치하지 않거나 회원가입이 불가능합니다.',
                        type: 'warning'
                    });
                    callback(false);
                }
            })
            .catch(error => {
                alertModal.openModal({
                    title: '오류 발생',
                    message: '사업자 번호 인증 중 오류가 발생했습니다. 다시 시도해주세요.',
                    type: 'error'
                });
                callback(false);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 가입하기
    const businessRegistration = () => {
        validateBusinessNumber((isValid) => {
            if (isValid) {
                AlertModal.openModal({
                    title: '권한 제한',
                    message: '사업자 인증에 성공했습니다.',
                    type: 'success',
                    onClose: () => navigate('/register/company')
                });

                // 로컬 스토리지에 저장 (값이 올바르게 저장되는지 콘솔로 확인)
                console.log("저장되는 값:", { companyRegistrationNumber, companyOwnerName, companyOpenDate });

                // 로컬 스토리지에 저장
                localStorage.setItem("companyRegistrationNumber", companyRegistrationNumber);
                localStorage.setItem("companyOwnerName", companyOwnerName);
                localStorage.setItem("companyOpenDate", companyOpenDate);

                navigate('/register/company'); // RegisterCompany로 이동
            } else {
                AlertModal.openModal({
                    title: '정보 불일치',
                    message: '사업자 정보가 일치하지 않습니다. 다시 확인해주세요.',
                    type: 'warning',
                });
            }
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">사업자 번호 인증</h2>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700">
                        사업자 등록번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyRegistrationNumber"
                        value={companyRegistrationNumber}
                        onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                        placeholder="사업자 번호를 입력하세요 (숫자만 입력)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="companyOpenDate" className="block text-sm font-medium text-gray-700">
                        개업일 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyOpenDate"
                        value={companyOpenDate}
                        onChange={(e) => setCompanyOpenDate(e.target.value)}
                        placeholder="개업일을 입력하세요 (YYYYMMDD)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700">
                        대표자 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="companyOwnerName"
                        value={companyOwnerName}
                        onChange={(e) => setCompanyOwnerName(e.target.value)}
                        placeholder="대표자 이름을 입력하세요"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={() => validateBusinessNumber(() => {})}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? '인증 처리 중...' : '인증 확인'}
                    </button>
                </div>

                <div className="pt-2">
                    <button
                        onClick={businessRegistration}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        다음으로
                    </button>
                </div>
            </div>

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

export default BusinessValidation;