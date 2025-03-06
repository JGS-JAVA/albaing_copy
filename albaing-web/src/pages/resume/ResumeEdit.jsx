import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import EducationModal from '../../components/EducationModal';
import CareerModal from '../../components/CareerModal';
import apiResumeService from "./apiResumeService";

const ResumeEdit = () => {
    const [resumeData, setResumeData] = useState({
        resumeId: null,
        userId: null,
        resumeTitle: '',
        resumeLocation: '',
        resumeJobCategory: '',
        resumeJobType: '',
        resumeJobDuration: '',
        resumeWorkSchedule: '',
        resumeWorkTime: '',
        resumeJobSkill: '',
        resumeIntroduction: '',
        educationHistory: null,
        careerHistory: null
    });

    const [showEducationModal, setShowEducationModal] = useState(false);
    const [showCareerModal, setShowCareerModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const { userData } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const resumeId = queryParams.get('resumeId');

    const jobCategories = [
        '외식/음료', '유통/판매', '문화/여가생활', '서비스', '사무/회계',
        '고객상담/리서치', '생산/건설/노무', 'IT/기술', '디자인', '미디어',
        '운전/배달', '병원/간호/연구', '교육/강사'
    ];

    const jobTypes = ['알바', '정규직', '계약직', '파견직', '인턴'];
    const workingPeriods = ['무관', '하루', '1일~1개월', '1~3개월', '3~6개월', '6개월이상'];
    const workSchedules = ['무관', '평일', '주말'];
    const shiftHours = ['무관', '오전(06:00~12:00)', '오후(12:00~18:00)', '저녁(18:00~24:00)', '새벽(00:00~06:00)'];

    useEffect(() => {
        const fetchResume = () => {
            setLoading(true);
            setError(null);

            if (resumeId && resumeId !== 'undefined') {
                apiResumeService.getResume(resumeId)
                    .then(data => {
                        console.log("이력서 데이터 로드 성공:", data);
                        setResumeData(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('URL의 이력서 ID로 조회 오류:', err);
                        fetchResumeByUserData();
                    });
            } else {
                fetchResumeByUserData();
            }
        };

        const fetchResumeByUserData = () => {
            if (userData && userData.resumeId) {
                apiResumeService.getResume(userData.resumeId)
                    .then(data => {
                        console.log("사용자 정보의 이력서 ID로 데이터 로드 성공:", data);
                        setResumeData(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('사용자 정보의 이력서 ID로 조회 오류:', err);

                        fetchResumeByUserId();
                    });
            } else {
                fetchResumeByUserId();
            }
        };

        const fetchResumeByUserId = () => {
            if (userData && userData.userId) {
                apiResumeService.getResumeByUserId(userData.userId)
                    .then(data => {
                        console.log("userId로 이력서 데이터 로드 성공:", data);
                        setResumeData(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('userId로 이력서 조회 오류:', err);
                        setError('이력서 정보를 찾을 수 없습니다. 관리자에게 문의하세요.');
                        setLoading(false);
                    });
            } else {
                setError('이력서 정보를 찾을 수 없습니다. 관리자에게 문의하세요.');
                setLoading(false);
            }
        };

        fetchResume();
    }, [userData, resumeId]);

    const validateForm = () => {
        const errors = {};

        if (!resumeData.resumeTitle.trim()) {
            errors.resumeTitle = '이력서 제목을 입력해주세요.';
        }

        if (!resumeData.resumeId) {
            errors.resumeId = '이력서 ID가 없습니다. 다시 로그인 후 시도해주세요.';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field if it exists
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleEducationUpdate = (educationData) => {
        console.log("학력 정보 업데이트 받음:", educationData);
        setResumeData(prev => {
            const updated = {
                ...prev,
                educationHistory: educationData
            };
            console.log("학력 정보 업데이트 후 이력서 데이터:", updated);
            return updated;
        });
        setShowEducationModal(false);
    };

    const handleCareerUpdate = (careerData) => {
        console.log("경력 정보 업데이트 받음:", careerData);
        setResumeData(prev => {
            const updated = {
                ...prev,
                careerHistory: careerData
            };
            console.log("경력 정보 업데이트 후 이력서 데이터:", updated);
            return updated;
        });
        setShowCareerModal(false);
    };

    const handleSaveResume = () => {
        if (!validateForm()) {
            window.scrollTo(0, 0);
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);

        const requestData = {
            resume: {
                resumeId: resumeData.resumeId,
                userId: resumeData.userId,
                resumeTitle: resumeData.resumeTitle,
                resumeLocation: resumeData.resumeLocation,
                resumeJobCategory: resumeData.resumeJobCategory,
                resumeJobType: resumeData.resumeJobType,
                resumeJobDuration: resumeData.resumeJobDuration,
                resumeWorkSchedule: resumeData.resumeWorkSchedule,
                resumeWorkTime: resumeData.resumeWorkTime,
                resumeJobSkill: resumeData.resumeJobSkill,
                resumeIntroduction: resumeData.resumeIntroduction
            },
            educationHistory: resumeData.educationHistory,
            careerHistory: resumeData.careerHistory
        };

        console.log("이력서 저장 요청 데이터:", requestData);

        apiResumeService.updateResume(resumeData.resumeId, requestData)
            .then(response => {
                console.log("이력서 저장 성공:", response);
                setSuccess(true);
                setSaving(false);

                setTimeout(() => {
                    navigate('/resumes');
                }, 3000);
            })
            .catch(error => {
                console.error('이력서 저장 오류:', error);
                console.error('에러 상세 정보:', error.response?.data);
                setError('이력서를 저장하는 중 오류가 발생했습니다: ' + (error.response?.data?.message || error.message));
                setSaving(false);

                window.scrollTo(0, 0);
            });
    };

    if (loading && !resumeData.resumeId) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    이력서 수정
                </h1>
                <p className="text-gray-600">
                    이력서를 수정하여 다양한 일자리에 지원해보세요.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-medium">오류</p>
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                    <p className="font-medium">성공</p>
                    <p>이력서가 성공적으로 저장되었습니다. 잠시 후 이력서 페이지로 이동합니다.</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>

                    <div className="mb-4">
                        <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            이력서 제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="resumeTitle"
                            name="resumeTitle"
                            value={resumeData.resumeTitle}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="이력서 제목을 입력하세요"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="resumeLocation" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 근무지
                            </label>
                            <input
                                type="text"
                                id="resumeLocation"
                                name="resumeLocation"
                                value={resumeData.resumeLocation}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                placeholder="예: 서울시 강남구"
                            />
                        </div>

                        <div>
                            <label htmlFor="resumeJobCategory" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 직종
                            </label>
                            <select
                                id="resumeJobCategory"
                                name="resumeJobCategory"
                                value={resumeData.resumeJobCategory}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {jobCategories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resumeJobType" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 고용형태
                            </label>
                            <select
                                id="resumeJobType"
                                name="resumeJobType"
                                value={resumeData.resumeJobType}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resumeJobDuration" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 근무기간
                            </label>
                            <select
                                id="resumeJobDuration"
                                name="resumeJobDuration"
                                value={resumeData.resumeJobDuration}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {workingPeriods.map((period, index) => (
                                    <option key={index} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resumeWorkSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 근무요일
                            </label>
                            <select
                                id="resumeWorkSchedule"
                                name="resumeWorkSchedule"
                                value={resumeData.resumeWorkSchedule}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {workSchedules.map((schedule, index) => (
                                    <option key={index} value={schedule}>{schedule}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="resumeWorkTime" className="block text-sm font-medium text-gray-700 mb-1">
                                희망 근무시간
                            </label>
                            <select
                                id="resumeWorkTime"
                                name="resumeWorkTime"
                                value={resumeData.resumeWorkTime}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">선택</option>
                                {shiftHours.map((hour, index) => (
                                    <option key={index} value={hour}>{hour}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 학력 정보 섹션 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">학력 정보</h2>
                        <button
                            type="button"
                            onClick={() => setShowEducationModal(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            {resumeData.educationHistory ? '수정' : '추가'}
                        </button>
                    </div>

                    {resumeData.educationHistory ? (
                        <div className="bg-gray-50 p-4 rounded-md">
                            <div className="mb-2">
                                <span className="font-medium">학교명:</span> {resumeData.educationHistory.eduSchool || '미입력'}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">전공:</span> {resumeData.educationHistory.eduMajor || '미입력'}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">학위:</span> {resumeData.educationHistory.eduDegree || '미입력'}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">재학상태:</span> {resumeData.educationHistory.eduStatus || '미입력'}
                            </div>
                            <div className="mb-2">
                                <span className="font-medium">입학년도:</span> {resumeData.educationHistory.eduAdmissionYear || '미입력'}
                            </div>
                            <div>
                                <span className="font-medium">졸업년도:</span> {resumeData.educationHistory.eduGraduationYear || '미입력'}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">등록된 학력 정보가 없습니다. '추가' 버튼을 눌러 학력 정보를 등록해주세요.</p>
                    )}
                </div>

                {/* 경력 정보 섹션 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">경력 정보</h2>
                        <button
                            type="button"
                            onClick={() => setShowCareerModal(true)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            {resumeData.careerHistory ? '수정' : '추가'}
                        </button>
                    </div>

                    {resumeData.careerHistory ? (
                        <div className="bg-gray-50 p-4 rounded-md">
                            {resumeData.careerHistory.careerIsCareer === '신입' ? (
                                <div className="text-lg font-medium text-blue-600">신입</div>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <span className="font-medium">회사명:</span> {resumeData.careerHistory.careerCompanyName || '미입력'}
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-medium">입사일:</span> {resumeData.careerHistory.careerJoinDate || '미입력'}
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-medium">퇴사일:</span> {resumeData.careerHistory.careerQuitDate || '재직중'}
                                    </div>
                                    <div>
                                        <span className="font-medium">직무 내용:</span> {resumeData.careerHistory.careerJobDescription || '미입력'}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">등록된 경력 정보가 없습니다. '추가' 버튼을 눌러 경력 정보를 등록해주세요.</p>
                    )}
                </div>

                {/* 보유 스킬 섹션 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">보유 스킬</h2>
                    <div className="mb-4">
                        <label htmlFor="resumeJobSkill" className="block text-sm font-medium text-gray-700 mb-1">
                            보유 스킬 (쉼표로 구분)
                        </label>
                        <input
                            type="text"
                            id="resumeJobSkill"
                            name="resumeJobSkill"
                            value={resumeData.resumeJobSkill}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="예: MS Office, 운전면허, 영어회화"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            보유하고 계신 스킬을 쉼표(,)로 구분하여 입력해주세요.
                        </p>
                    </div>
                </div>

                {/* 자기소개 섹션 */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">자기소개</h2>
                    <div>
                        <label htmlFor="resumeIntroduction" className="block text-sm font-medium text-gray-700 mb-1">
                            자기소개
                        </label>
                        <textarea
                            id="resumeIntroduction"
                            name="resumeIntroduction"
                            value={resumeData.resumeIntroduction}
                            onChange={handleChange}
                            rows={5}
                            className="w-full p-2 border rounded-md"
                            placeholder="간단한 자기소개를 작성해주세요."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* 저장 버튼 */}
            <div className="p-6 bg-gray-50 rounded-md flex justify-end">
                <button
                    type="button"
                    onClick={handleSaveResume}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? '저장 중...' : '이력서 저장'}
                </button>
            </div>

            {/* 학력 정보 모달 */}
            {showEducationModal && (
                <EducationModal
                    educationData={resumeData.educationHistory}
                    onSave={handleEducationUpdate}
                    onCancel={() => setShowEducationModal(false)}
                />
            )}

            {/* 경력 정보 모달 */}
            {showCareerModal && (
                <CareerModal
                    careerData={resumeData.careerHistory}
                    onSave={handleCareerUpdate}
                    onCancel={() => setShowCareerModal(false)}
                />
            )}
        </div>
    );
};

export default ResumeEdit;