import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Contact = () => {
    const { isLoggedIn, userData } = useAuth();

    const [formData, setFormData] = useState({
        name: userData?.userName || '',
        email: userData?.userEmail || '',
        phone: userData?.userPhone || '',
        subject: '',
        message: '',
        type: 'general'
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
        if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요';
        if (!formData.subject.trim()) newErrors.subject = '제목을 입력해주세요';
        if (!formData.message.trim()) newErrors.message = '문의 내용을 입력해주세요';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 메시지 지우기
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // 여기서 API 요청을 보내는 코드가 들어갈 수 있습니다.
        // 지금은 더미 기능이므로 타임아웃으로 처리합니다.
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);

            // 폼 초기화
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                type: 'general'
            });

            // 성공 메시지 3초 후 사라짐
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">문의하기</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* 연락처 정보 */}
                <div className="md:w-1/3">
                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">고객센터 정보</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">이메일</h3>
                                <p className="text-blue-600">support@albaing.com</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">전화번호</h3>
                                <p className="text-blue-600">02-1234-5678</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">운영시간</h3>
                                <p className="text-gray-700">평일 09:00 - 18:00</p>
                                <p className="text-gray-500 text-sm">(주말 및 공휴일 휴무)</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">주소</h3>
                                <p className="text-gray-700">서울특별시 강남구 테헤란로14길 6</p>
                                <p className="text-gray-700">남도빌딩 2층</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 문의 양식 */}
                <div className="md:w-2/3">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {submitSuccess ? (
                            <div className="bg-green-50 p-4 rounded-md text-green-800 mb-4">
                                <p className="font-medium">문의가 성공적으로 접수되었습니다!</p>
                                <p className="text-sm mt-1">빠른 시일 내에 답변 드리겠습니다.</p>
                            </div>
                        ) : null}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        이름 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        이메일 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    전화번호
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    문의 유형
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="general">일반 문의</option>
                                    <option value="technical">기술 지원</option>
                                    <option value="billing">결제 문의</option>
                                    <option value="partnership">제휴 문의</option>
                                    <option value="complaint">불만 사항</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    제목 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`w-full p-2 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                            </div>

                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    문의 내용 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`w-full p-2 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                ></textarea>
                                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? '처리 중...' : '문의하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;