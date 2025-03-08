import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from "react-router-dom";
import { ErrorMessage, LoadingSpinner } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";

const CompanyManage = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType, userData } = useAuth();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [companyData, setCompanyData] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 로그인 및 기업 사용자 여부 체크
        if (isLoggedIn === null || userData === null) return;
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        if (userType !== 'company') {
            navigate('/');
            return;
        }
        if (userData && userData.companyId && parseInt(companyId) !== userData.companyId) {
            navigate(`/company/manage/${userData.companyId}`);
            return;
        }

        setLoading(true);
        axios.get(`http://localhost:8080/api/companies/${companyId}`, { withCredentials: true })
            .then(companyRes => {
                setCompanyData(companyRes.data);
                return axios.get(`http://localhost:8080/api/jobs/company/${companyId}`, { withCredentials: true });
            })
            .then(jobRes => {
                setJobPosts(jobRes.data);
                // 회사 기준 지원자 목록 조회
                return axios.get(`http://localhost:8080/api/applications/company/${companyId}`, { withCredentials: true });
            })
            .then(appRes => {
                setApplications(appRes.data); // JobApplication 리스트 (조인 필드 포함)
                setLoading(false);
            })
            .catch(err => {
                console.error("데이터 로딩 오류:", err);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [companyId, isLoggedIn, navigate, userData, userType]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCreateJobPost = () => {
        window.location.href = '/jobs/new';
    };

    const updateApplicantStatus = (applicationId, newStatus) => {
        axios.put(`http://localhost:8080/api/applications/${applicationId}`, { approveStatus: newStatus }, { withCredentials: true })
            .then(() => {
                setApplications(prev =>
                    prev.map(app =>
                        app.jobApplicationId === applicationId
                            ? { ...app, approveStatus: newStatus }
                            : app
                    )
                );
            })
            .catch(err => {
                console.error("지원자 상태 업데이트 오류:", err);
            });
    };


    if (loading) return <LoadingSpinner message="로딩 중..." fullScreen={false} />
    if (error) return <ErrorMessage message={error} />

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 사이드바 */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {companyData && companyData.companyName}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Company Dashboard</p>
                </div>

                <nav className="mt-6">
                    <ul>
                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'dashboard' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('dashboard')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">대시보드</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'jobPosts' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('jobPosts')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">기업 채용공고</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'applications' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('applications')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">지원자 관리</span>
                            </div>
                        </li>

                        <li
                            className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                activeTab === 'profile' ? 'bg-blue-100 border-l-4 border-blue-500' : ''
                            }`}
                            onClick={() => handleTabChange('profile')}
                        >
                            <div className="flex items-center">
                                <span className="ml-2">회사 정보</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* 대시보드 탭 */}
                {activeTab === 'dashboard' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">기업 대시보드</h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* 요약 카드들 */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">Active Job Postings</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {jobPosts.filter(job => job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()).length}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {applications.length}
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-gray-500 text-sm font-medium">New Applications</h3>
                                </div>
                                <p className="text-3xl font-bold text-gray-700 mt-2">
                                    {applications.filter(app => !app.viewed).length}
                                </p>
                            </div>
                        </div>

                        {/* 최근 채용공고 목록 */}
                        <div className="bg-white rounded-lg shadow mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-800">채용공고</h3>
                            </div>
                            <div className="p-6">
                                {jobPosts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    제목</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고상태</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {jobPosts.slice(0, 5).map((job, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                        <Link to={`/jobs/${job.jobPostId}`}>{job.jobPostTitle}</Link>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.jobPostJobCategory}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {job.jobPostWorkPlace}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(job.jobPostDueDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date() ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                    채용중
                                                                </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                    마감
                                                                </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">존재하는 공고가 없습니다. 새로운 공고를 올려보세요</p>
                                )}
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={handleCreateJobPost}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                        새로운 채용 공고 작성
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 기업 채용공고 탭 */}
                {activeTab === 'jobPosts' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">기업 채용공고</h1>
                            <button
                                onClick={handleCreateJobPost}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                새로운 채용 공고 작성
                            </button>
                        </div>

                        {jobPosts.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채용형태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무지</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">채용마감일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {jobPosts.map((job, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 max-w-[200px] overflow-hidden text-ellipsis">
                                                <Link to={`/jobs/${job.jobPostId}`}>{job.jobPostTitle}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.jobPostJobCategory}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.jobPostJobType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px] overflow-hidden text-ellipsis">
                                                {job.jobPostWorkPlace}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(job.jobPostDueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date() ? (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            채용중
                                                        </span>
                                                ) : (
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            마감
                                                        </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => window.location.href = `/jobs/edit/${job.jobPostId}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    수정하기
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const newStatus = !job.jobPostStatus;
                                                        axios
                                                            .patch(`http://localhost:8080/api/jobs/${job.jobPostId}/status?status=${newStatus}`)
                                                            .then(() => {
                                                                // 상태 업데이트
                                                                const updatedJobs = [...jobPosts];
                                                                updatedJobs[index].jobPostStatus = newStatus;
                                                                setJobPosts(updatedJobs);
                                                            })
                                                            .catch(err => console.error('Error updating status:', err));
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    {job.jobPostStatus ? '마감하기' : '채용활성화'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500 mb-4">해당 기업에서 올린 채용공고가 없습니다.</p>
                                <button
                                    onClick={handleCreateJobPost}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    새로운 공고 올리기
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">지원자 관리</h1>
                        {applications.length > 0 ? (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원자 성함</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고 제목</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">지원 날짜</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {applications.map((app, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50" // viewed 여부 대신 상태나 다른 조건에 따라 색칠 가능
                                        >
                                            {/* 지원자 이름 */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {app.applicantName}
                                            </td>

                                            {/* 공고 제목 */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {app.jobPostTitle}
                                            </td>

                                            {/* 지원 날짜: applicationAt 사용 */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.applicationAt).toLocaleDateString()}
                                            </td>

                                            {/* 상태: approveStatus 사용 */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.approveStatus === 'approving'
                              ? 'bg-yellow-100 text-yellow-800'
                              : app.approveStatus === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {app.approveStatus === 'approving'
                        ? '대기중'
                        : app.approveStatus === 'approved'
                            ? '합격'
                            : '불합격'}
                  </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => updateApplicantStatus(app.jobApplicationId, 'approved')}
                                                    className="text-green-600 hover:text-green-800 mr-2"
                                                >
                                                    합격 처리
                                                </button>
                                                <button
                                                    onClick={() => updateApplicantStatus(app.jobApplicationId, 'denied')}
                                                    className="text-red-600 hover:text-red-800 mr-2"
                                                >
                                                    불합격 처리
                                                </button>
                                                <button
                                                    onClick={() => window.location.href = `/company/applications/${app.jobApplicationId}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    상세보기
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <p className="text-gray-500">아직 지원자가 없습니다.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 회사 정보 탭 */}
                {activeTab === 'profile' && companyData && (
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">회사 프로필</h1>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center mb-6">
                                    {companyData.companyLogo ? (
                                        <img
                                            src={companyData.companyLogo}
                                            alt="Company Logo"
                                            className="w-24 h-24 object-cover rounded-lg mr-6"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-200 rounded-lg mr-6 flex items-center justify-center text-gray-400">
                                            No Logo
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{companyData.companyName}</h2>
                                        <p className="text-gray-600">대표자 : {companyData.companyOwnerName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">회사정보</h3>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">이메일:</span> {companyData.companyEmail}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">회사연락처:</span> {companyData.companyPhone}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">본사 위치:</span> {companyData.companyLocalAddress}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">회사 창립일:</span> {companyData.companyOpenDate}</p>
                                        <p className="text-gray-600 mb-1"><span className="font-medium">사업자등록번호:</span> {companyData.companyRegistrationNumber}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">회사설명</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{companyData.companyDescription}</p>
                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={() => window.location.href = `/companies/${companyId}`}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        회사수정페이지가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyManage;