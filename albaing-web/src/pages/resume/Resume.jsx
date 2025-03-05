import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { formatEducation, formatCareer } from './apiResumeService';

const Resume = () => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isLoggedIn, userType, userData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // 사용자 인증 체크
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // 개인 회원 체크
        if (userType !== 'personal') {
            navigate('/');
            return;
        }

        // 이력서 조회
        if (userData?.userId) {
            setLoading(true);

            // GET 요청 대신에 백엔드 개발자에게 정확한 API 엔드포인트 확인 필요
            // 현재는 ResumeController에서 이력서 ID로만 조회하도록 구현되어 있음
            axios.get(`/api/resume/${userData.resumeId}`)
                .then(response => {
                    setResume(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('이력서 조회 오류:', error);
                    setError('이력서를 불러오는 중 오류가 발생했습니다.');
                    setLoading(false);
                });
        }
    }, [isLoggedIn, userType, userData, navigate]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                다시 시도
            </button>
        </div>;
    }

    // 이력서가 없는 경우 (이 조건은 실제로는 발생하지 않을 수 있음, 회원가입 시 자동 생성되므로)
    if (!resume) {
        return <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">이력서를 찾을 수 없습니다.</h2>
            <p className="text-gray-600 mb-6">이력서 정보를 불러오는데 문제가 발생했습니다.</p>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                홈으로 돌아가기
            </Link>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{resume.resumeTitle}</h1>
                <Link
                    to={`/resumes/edit?resumeId=${resume.resumeId}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    수정하기
                </Link>
            </div>

            {/* 이력서 프리뷰 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {/* 기본 정보 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">기본 정보</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 근무지</p>
                            <p className="text-lg">{resume.resumeLocation || '미등록'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 직종</p>
                            <p className="text-lg">{resume.resumeJobCategory || '미등록'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 고용형태</p>
                            <p className="text-lg">{resume.resumeJobType || '미등록'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 근무기간</p>
                            <p className="text-lg">{resume.resumeJobDuration || '미등록'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 근무요일</p>
                            <p className="text-lg">{resume.resumeWorkSchedule || '미등록'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-1">희망 근무시간</p>
                            <p className="text-lg">{resume.resumeWorkTime || '미등록'}</p>
                        </div>
                    </div>
                </div>

                {/* 학력 정보 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">학력 정보</h2>
                    <p className="text-lg">{formatEducation(resume.educationHistory)}</p>
                </div>

                {/* 경력 정보 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">경력 정보</h2>
                    <p className="text-lg">{formatCareer(resume.careerHistory)}</p>
                </div>

                {/* 보유 스킬 */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">보유 스킬</h2>
                    {resume.resumeJobSkill ? (
                        <div className="flex flex-wrap gap-2">
                            {resume.resumeJobSkill.split(',').map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">등록된 스킬이 없습니다.</p>
                    )}
                </div>

                {/* 자기소개 */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">자기소개</h2>
                    {resume.resumeIntroduction ? (
                        <p className="text-gray-800 whitespace-pre-line">{resume.resumeIntroduction}</p>
                    ) : (
                        <p className="text-gray-500">등록된 자기소개가 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 공고 지원 안내 */}
            <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-blue-900 mb-2">알바잉에서 채용 공고를 확인해보세요!</h3>
                <p className="text-blue-800 mb-4">이력서를 작성했다면 다양한 채용 공고에 지원할 수 있습니다.</p>
                <Link
                    to="/jobs"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    채용공고 보러가기
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default Resume;