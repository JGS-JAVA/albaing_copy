import { useState, useEffect } from 'react';

const EducationModal = ({ educationData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        educationId: null,
        resumeId: null,
        eduDegree: '',
        eduStatus: '',
        eduSchool: '',
        eduMajor: '',
        eduAdmissionYear: '',
        eduGraduationYear: ''
    });

    // 학력 분류
    const degreeOptions = ['고등학교', '전문대학(2,3년제)', '대학교(4년제)', '대학원(석사)', '대학원(박사)'];
    const statusOptions = ['졸업', '재학중', '휴학중', '중퇴', '수료', '졸업예정'];

    // 연도 옵션 생성 (현재 연도 기준 -50년부터 +5년까지)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 56 }, (_, i) => currentYear - 50 + i);

    useEffect(() => {
        // 기존 데이터가 있으면 폼에 설정
        if (educationData) {
            setFormData({
                educationId: educationData.educationId || null,
                resumeId: educationData.resumeId || null,
                eduDegree: educationData.eduDegree || '',
                eduStatus: educationData.eduStatus || '',
                eduSchool: educationData.eduSchool || '',
                eduMajor: educationData.eduMajor || '',
                eduAdmissionYear: educationData.eduAdmissionYear || '',
                eduGraduationYear: educationData.eduGraduationYear || ''
            });
        }
    }, [educationData]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 학교명은 필수 입력
        if (!formData.eduSchool.trim()) {
            alert('학교명을 입력해주세요.');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">학력 정보 {educationData ? '수정' : '추가'}</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="eduSchool" className="block text-sm font-medium text-gray-700 mb-1">
                                학교명 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="eduSchool"
                                name="eduSchool"
                                value={formData.eduSchool}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="학교명을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="eduDegree" className="block text-sm font-medium text-gray-700 mb-1">
                                학위
                            </label>
                            <select
                                id="eduDegree"
                                name="eduDegree"
                                value={formData.eduDegree}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {degreeOptions.map((degree, index) => (
                                    <option key={index} value={degree}>{degree}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="eduStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                재학상태
                            </label>
                            <select
                                id="eduStatus"
                                name="eduStatus"
                                value={formData.eduStatus}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {statusOptions.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="eduMajor" className="block text-sm font-medium text-gray-700 mb-1">
                                전공
                            </label>
                            <input
                                type="text"
                                id="eduMajor"
                                name="eduMajor"
                                value={formData.eduMajor}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="전공을 입력하세요"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="eduAdmissionYear" className="block text-sm font-medium text-gray-700 mb-1">
                                    입학년도
                                </label>
                                <select
                                    id="eduAdmissionYear"
                                    name="eduAdmissionYear"
                                    value={formData.eduAdmissionYear}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md bg-white"
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="eduGraduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                                    졸업년도
                                </label>
                                <select
                                    id="eduGraduationYear"
                                    name="eduGraduationYear"
                                    value={formData.eduGraduationYear}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md bg-white"
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year, index) => (
                                        <option key={index} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationModal;