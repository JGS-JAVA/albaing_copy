import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner, ErrorMessage } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";
import apiResumeService from "../../../service/apiResumeService";

// 지원자 이력서를 모달로 보여주는 컴포넌트
function ResumeModal({ resumeId, onClose }) {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!resumeId) {
            setError("이력서 ID가 제공되지 않았습니다.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // 이력서 ID로 이력서 정보를 조회합니다.
        apiResumeService
            .getResume(resumeId)
            .then((data) => {
                setResume(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("이력서 조회 실패:", err);
                setError("이력서를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [resumeId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="닫기"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {loading ? (
                    <LoadingSpinner message="이력서 로딩 중..." fullScreen={false} />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : resume ? (
                    <div className="overflow-y-auto max-h-[80vh]">
                        <h2 className="text-2xl font-bold mb-4">{resume.resumeTitle}</h2>
                        <p className="text-sm text-gray-600 mb-2">
                            최종 수정일: {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                        {/* 기본 정보 */}
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold">기본 정보</h3>
                            <p>희망 근무지: {resume.resumeLocation || "미등록"}</p>
                            <p>희망 직종: {resume.resumeJobCategory || "미등록"}</p>
                            <p>희망 고용형태: {resume.resumeJobType || "미등록"}</p>
                            <p>희망 근무기간: {resume.resumeJobDuration || "미등록"}</p>
                            <p>희망 근무요일: {resume.resumeWorkSchedule || "미등록"}</p>
                            <p>희망 근무시간: {resume.resumeWorkTime || "미등록"}</p>
                        </div>
                        {/* 학력 정보 */}
                        {resume.educationHistory && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">학력 정보</h3>
                                <p>학교: {resume.educationHistory.eduSchool || "미입력"}</p>
                                <p>전공: {resume.educationHistory.eduMajor || "미입력"}</p>
                                <p>학위: {resume.educationHistory.eduDegree || "미입력"}</p>
                                <p>
                                    기간: {resume.educationHistory.eduAdmissionYear} ~{" "}
                                    {resume.educationHistory.eduGraduationYear || "현재"}
                                </p>
                            </div>
                        )}
                        {/* 경력 정보 */}
                        {resume.careerHistory && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">경력 정보</h3>
                                <p>회사: {resume.careerHistory.careerCompanyName || "미입력"}</p>
                                <p>
                                    기간: {resume.careerHistory.careerJoinDate} ~{" "}
                                    {resume.careerHistory.careerQuitDate || "재직중"}
                                </p>
                                <p>직무: {resume.careerHistory.careerJobDescription || "미입력"}</p>
                            </div>
                        )}
                        {/* 보유 스킬 */}
                        {resume.resumeJobSkill && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">보유 스킬</h3>
                                <p>{resume.resumeJobSkill}</p>
                            </div>
                        )}
                        {/* 자기소개 */}
                        {resume.resumeIntroduction && (
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold">자기소개</h3>
                                <p>{resume.resumeIntroduction}</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default function JobApplicationManager() {
    const { jobPostId } = useParams();
    const { isLoggedIn, userType } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 이력서 모달 관련 상태
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [showResumeModal, setShowResumeModal] = useState(false);

    useEffect(() => {
        if (!jobPostId) {
            setError("잘못된 접근입니다. 채용공고 ID가 필요합니다.");
            setLoading(false);
            return;
        }

        // 기업 회원만 접근 가능하도록 체크
        if (!isLoggedIn || userType !== "company") {
            setError("접근 권한이 없습니다. 기업 회원만 지원자 관리를 할 수 있습니다.");
            setLoading(false);
            return;
        }

        fetchApplications();
    }, [jobPostId, isLoggedIn, userType]);

    // 지원자 목록을 API를 통해 불러옵니다.
    const fetchApplications = () => {
        setLoading(true);
        axios
            .get(`http://localhost:8080/api/applications/jobPost/${jobPostId}`)
            .then((response) => {
                setApplications(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("지원자 목록을 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    };

    // 지원 상태(승인/거절) 변경 API 호출
    const handleDecision = (jobApplicationId, decision) => {
        axios
            .put(`http://localhost:8080/api/applications/${jobApplicationId}`, {
                approveStatus: decision,
            })
            .then((response) => {
                fetchApplications();
            })
            .catch((err) => {
                alert("지원 상태를 변경하는 중 오류가 발생했습니다.");
            });
    };

    // 이력서 보기 버튼 클릭 시, 모달에 표시할 이력서 ID를 설정합니다.
    const handleViewResume = (resumeId) => {
        setSelectedResumeId(resumeId);
        setShowResumeModal(true);
    };

    if (loading) return <LoadingSpinner message="지원자 목록 로딩 중..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">지원자 관리</h2>
            {applications.length === 0 ? (
                <p>해당 공고에 지원한 지원자가 없습니다.</p>
            ) : (
                <table className="min-w-full bg-white border">
                    <thead>
                    <tr>
                        <th className="py-2 px-4 border">지원 ID</th>
                        <th className="py-2 px-4 border">이력서 ID</th>
                        <th className="py-2 px-4 border">지원일</th>
                        <th className="py-2 px-4 border">현재 상태</th>
                        <th className="py-2 px-4 border">행동</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((app) => (
                        <tr key={app.jobApplicationId}>
                            <td className="border px-4 py-2">{app.jobApplicationId}</td>
                            <td className="border px-4 py-2">{app.resumeId}</td>
                            <td className="border px-4 py-2">
                                {new Date(app.applicationAt).toLocaleString()}
                            </td>
                            <td className="border px-4 py-2">{app.approveStatus}</td>
                            <td className="border px-4 py-2">
                                {app.approveStatus === "PENDING" && (
                                    <>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
                                            onClick={() =>
                                                handleDecision(app.jobApplicationId, "APPROVED")
                                            }
                                        >
                                            승인
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 mr-2 rounded"
                                            onClick={() =>
                                                handleDecision(app.jobApplicationId, "REJECTED")
                                            }
                                        >
                                            거절
                                        </button>
                                    </>
                                )}
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleViewResume(app.resumeId)}
                                >
                                    이력서 보기
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {/* 이력서 모달 표시 */}
            {showResumeModal && (
                <ResumeModal
                    resumeId={selectedResumeId}
                    onClose={() => setShowResumeModal(false)}
                />
            )}
        </div>
    );
}
