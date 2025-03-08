import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ErrorMessage, LoadingSpinner } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";

export default function JobPostDetail() {
    const { jobPostId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType, userData } = useAuth();

    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resumeId, setResumeId] = useState(null);
    const [modal, setModal] = useState({ show: false, message: "", type: "" });
    const [isScraped, setIsScraped] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [applicationResult, setApplicationResult] = useState(null);

    useEffect(() => {
        if (!jobPostId) {
            console.error("jobPostId가 존재하지 않습니다.");
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        setLoading(true);
        axios
            .get(`http://localhost:8080/api/jobs/${jobPostId}`)
            .then((response) => {
                if (response.data) {
                    setJobPost(response.data);
                    if (isLoggedIn && userType === "personal") {
                        const scrapedPosts = JSON.parse(
                            localStorage.getItem("scrapedPosts") || "[]"
                        );
                        if (scrapedPosts.includes(Number(jobPostId))) {
                            setIsScraped(true);
                        }
                        fetchResumeAndCheckApplication();
                    }
                } else {
                    setError("공고 정보가 없습니다.");
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("API 오류:", error);
                setError("채용 공고 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [jobPostId, isLoggedIn, userType, userData]);

    function fetchResumeAndCheckApplication() {
        if (!isLoggedIn || userType !== "personal" || !userData) return;
        const userId = userData.data?.userId || userData.userId;
        if (!userId) {
            console.error("사용자 ID를 찾을 수 없습니다.");
            return;
        }
        axios
            .get(`http://localhost:8080/api/resume/user/${userId}`)
            .then((response) => {
                if (response.data && response.data.resumeId) {
                    setResumeId(response.data.resumeId);
                    checkAlreadyApplied(response.data.resumeId);
                } else {
                    console.log("이력서가 없습니다.");
                    setResumeId(null);
                }
            })
            .catch((error) => {
                console.error("이력서 정보 확인 중 오류 발생:", error);
                setResumeId(null);
            });
    }

    function checkAlreadyApplied(currentResumeId) {
        if (!currentResumeId || !jobPostId) return;
        axios
            .get(`http://localhost:8080/api/applications/resume/${currentResumeId}`)
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    const hasApplied = response.data.some(
                        (application) =>
                            Number(application.jobPostId) === Number(jobPostId)
                    );
                    setAlreadyApplied(hasApplied);
                }
            })
            .catch((error) => {
                console.error("지원 내역 확인 중 오류 발생:", error);
            });
    }

    const showModal = (message, type) => {
        setModal({ show: true, message, type });
    };

    const closeModal = () => {
        setModal({ show: false, message: "", type: "" });
    };

    const goToResumeCreation = () => {
        closeModal();
        navigate("/resumes");
    };

    const handleApply = () => {
        if (!isLoggedIn) {
            showModal("로그인 후 이용 가능합니다.", "alert");
            return;
        }
        if (userType === "company") {
            showModal("기업 회원은 지원할 수 없습니다.", "alert");
            return;
        }
        if (!resumeId) {
            showModal("이력서가 없습니다. 작성하러 가시겠습니까?", "resume-confirm");
            return;
        }
        if (alreadyApplied) {
            showModal("이미 지원한 공고입니다.", "alert");
            return;
        }
        showModal("정말 이 공고에 지원하시겠습니까?", "confirm");
    };

    const confirmApply = () => {
        closeModal();
        if (!isLoggedIn || userType !== "personal" || !resumeId) return;
        // jobPostId와 resumeId만 전송 (applicationAt, approveStatus 제거)
        const applicationData = {
            jobPostId: Number(jobPostId),
            resumeId: Number(resumeId)
        };
        axios
            .post("http://localhost:8080/api/applications", applicationData)
            .then((response) => {
                console.log("지원 성공:", response.data);
                setAlreadyApplied(true);
                setApplicationResult({
                    success: true,
                    message: "지원 성공! 건투를 빕니다."
                });
                setModal({ show: true, message: "", type: "result" });
            })
            .catch((error) => {
                console.error("지원 API 오류:", error);
                let errorMessage = "지원 중 오류가 발생했습니다. 다시 시도해주세요.";
                // 서버에서 JSON 형태로 { message: "이미 지원한 공고입니다." } 반환 시 사용
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                setApplicationResult({
                    success: false,
                    message: errorMessage
                });
                setModal({ show: true, message: "", type: "result" });
            });
    };

    const toggleScrap = () => {
        if (!isLoggedIn) {
            showModal("로그인 후 이용 가능합니다.", "alert");
            return;
        }
        if (userType !== "personal") {
            showModal("개인 회원만 스크랩할 수 있습니다.", "alert");
            return;
        }
        let scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
        if (isScraped) {
            scrapedPosts = scrapedPosts.filter((id) => id !== Number(jobPostId));
        } else {
            scrapedPosts.push(Number(jobPostId));
        }
        localStorage.setItem("scrapedPosts", JSON.stringify(scrapedPosts));
        setIsScraped(!isScraped);
    };

    if (loading)
        return <LoadingSpinner message="로딩 중..." fullScreen={false} />;
    if (error) return <ErrorMessage message={error} />;
    if (!jobPost)
        return <div className="text-center py-10">해당 공고를 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
            {/* 개인 사용자 전용 스크랩 버튼 */}
            {isLoggedIn && userType === "personal" && (
                <button
                    className={`absolute top-10 right-6 p-2 rounded-full ${
                        isScraped
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={toggleScrap}
                    aria-label={isScraped ? "스크랩 취소" : "스크랩하기"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill={isScraped ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </button>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                {/* 상단: 제목 및 주요 정보 */}
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {jobPost.jobPostTitle || "제목 없음"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 text-sm">
                        <div>
                            <strong>직종 카테고리:</strong> {jobPost.jobPostJobCategory || "-"}
                        </div>
                        <div>
                            <strong>고용형태:</strong> {jobPost.jobPostJobType || "-"}
                        </div>
                        <div>
                            <strong>근무기간:</strong> {jobPost.jobPostWorkingPeriod || "-"}
                        </div>
                        <div>
                            <strong>근무요일:</strong> {jobPost.jobWorkSchedule || "-"}
                        </div>
                        <div>
                            <strong>근무시간:</strong> {jobPost.jobPostShiftHours || "-"}
                        </div>
                        <div>
                            <strong>급여:</strong> {jobPost.jobPostSalary || "-"}
                        </div>
                    </div>
                </div>

                {/* 세부 정보 */}
                <div className="mb-4 space-y-1 text-sm text-gray-600">
                    <p>
                        <strong>기업 ID:</strong> {jobPost.companyId || "-"}
                    </p>
                    <p>
                        <strong>근무지:</strong> {jobPost.jobPostWorkPlace || "-"}
                    </p>
                    <p>
                        <strong>마감일:</strong> {jobPost.jobPostDueDate || "-"}
                    </p>
                    <p>
                        <strong>연락처:</strong> {jobPost.jobPostContactNumber || "-"}
                    </p>
                    <p>
                        <strong>학력요건:</strong> {jobPost.jobPostRequiredEducations || "-"}
                    </p>
                </div>

                {/* 이미지 영역 */}
                {jobPost.jobPostOptionalImage && (
                    <div className="mt-4">
                        <img
                            src={jobPost.jobPostOptionalImage}
                            alt="채용공고 이미지"
                            className="w-full h-auto object-contain rounded"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://via.placeholder.com/600x400?text=No+Image";
                            }}
                        />
                    </div>
                )}

                {/* 지원하기 버튼 */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleApply}
                        className={`font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-200 ${
                            alreadyApplied
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                    >
                        {alreadyApplied ? "지원 완료" : "지원하기"}
                    </button>
                </div>
            </div>

            {/* 모달 */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        {modal.type === "confirm" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">지원 확인</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        onClick={closeModal}
                                    >
                                        아니오
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        onClick={confirmApply}
                                    >
                                        예
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "resume-confirm" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">이력서 확인</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                                        onClick={closeModal}
                                    >
                                        아니오
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        onClick={goToResumeCreation}
                                    >
                                        예
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "result" && (
                            <>
                                <h3
                                    className={`text-xl font-semibold mb-4 ${
                                        applicationResult?.success
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {applicationResult?.success ? "지원 완료" : "지원 실패"}
                                </h3>
                                <p className="mb-6">{applicationResult?.message}</p>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        onClick={closeModal}
                                    >
                                        확인
                                    </button>
                                </div>
                            </>
                        )}
                        {modal.type === "alert" && (
                            <>
                                <h3 className="text-xl font-semibold mb-4">알림</h3>
                                <p className="mb-6">{modal.message}</p>
                                <div className="flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                        onClick={closeModal}
                                    >
                                        확인
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
