import { useState, useEffect } from 'react';

const CareerModal = ({ careerData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        careerId: null,
        resumeId: null,
        careerCompanyName: '',
        careerJoinDate: '',
        careerQuitDate: '',
        careerJobDescription: '',
        careerIsCareer: '경력' // 기본값 경력
    });

    useEffect(() => {
        // 기존 데이터가 있으면 폼에 설정
        if (careerData) {
            setFormData({
                careerId: careerData.careerId || null,
                resumeId: careerData.resumeId || null,
                careerCompanyName: careerData.careerCompanyName || '',
                careerJoinDate: careerData.careerJoinDate || '',
                careerQuitDate: careerData.careerQuitDate || '',
                careerJobDescription: careerData.careerJobDescription || '',
                careerIsCareer: careerData.careerIsCareer || '경력'
            });
        }
    }, [careerData]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 신입/경력 토글 핸들러
    const handleCareerToggle = (value) => {
        setFormData(prev => ({
            ...prev,
            careerIsCareer: value
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        // 신입이면 회사명 필수가 아님
        if (formData.careerIsCareer !== '신입' && !formData.careerCompanyName.trim()) {
            alert('회사명을 입력해주세요.');
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">경력 정보 {careerData ? '수정' : '추가'}</h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">경력 구분:</span>
                            <button
                                type="button"
                                onClick={() => handleCareerToggle('신입')}
                                className={`px-3 py-1 rounded-md ${
                                    formData.careerIsCareer === '신입'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                신입
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCareerToggle('경력')}
                                className={`px-3 py-1 rounded-md ${
                                    formData.careerIsCareer === '경력'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                경력
                            </button>
                        </div>
                    </div>

                    {formData.careerIsCareer === '경력' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="careerCompanyName" className="block text-sm font-medium text-gray-700 mb-1">
                                    회사명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="careerCompanyName"
                                    name="careerCompanyName"
                                    value={formData.careerCompanyName}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="회사명을 입력하세요"
                                    required={formData.careerIsCareer === '경력'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="careerJoinDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        입사일
                                    </label>
                                    <input
                                        type="date"
                                        id="careerJoinDate"
                                        name="careerJoinDate"
                                        value={formData.careerJoinDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="careerQuitDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        퇴사일
                                    </label>
                                    <input
                                        type="date"
                                        id="careerQuitDate"
                                        name="careerQuitDate"
                                        value={formData.careerQuitDate}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        재직 중인 경우 비워두세요.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="careerJobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    담당업무
                                </label>
                                <textarea
                                    id="careerJobDescription"
                                    name="careerJobDescription"
                                    value={formData.careerJobDescription}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                    rows={3}
                                    placeholder="담당했던 업무를 간략히 설명해주세요."
                                ></textarea>
                            </div>
                        </div>
                    )}

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

export default CareerModal;