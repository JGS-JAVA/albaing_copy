import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ErrorMessage, LoadingSpinner } from "../../components/common";
import {useAuth} from "../../contexts/AuthContext";

export default function JobPostDetail() {
    const { id: jobPostId } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 모달 상태 관리
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState(""); // "confirm" 또는 "result"
    const [isScraped, setIsScraped] = useState(false);
    const [applicationResult, setApplicationResult] = useState(null);

    // 이미 지원한 공고인지 확인하는 상태
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    // AuthContext에서 사용자 정보 가져오기
    const { isLoggedIn, userType, userData } = useAuth();

    useEffect(() => {
        // 채용공고 정보 불러오기
        if (!jobPostId) {
            console.error("jobPostId가 존재하지 않습니다.");
            setError("잘못된 접근입니다.");
            setLoading(false);
            return;
        }

        axios
            .get(`http://localhost:8080/api/jobs/${jobPostId}`)
            .then((response) => {
                setJobPost(response.data);

                // 스크랩 상태 확인 (로컬 스토리지 사용 예시, 실제로는 API 호출 필요)
                if (isLoggedIn && userType === 'personal') {
                    const scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
                    if (scrapedPosts.includes(Number(jobPostId))) {
                        setIsScraped(true);
                    }

                    // 이미 지원한 공고인지 확인
                    checkIfAlreadyApplied();
                }

                setLoading(false);
            })
            .catch(() => {
                setError("채용 공고 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [jobPostId, isLoggedIn, userType, userData]);

    // 이미 지원한 공고인지 확인하는 함수
    const checkIfAlreadyApplied = () => {
        if (!isLoggedIn || userType !== 'personal' || !userData) {
            return;
        }

        const resumeId = userData.data.resumeId || userData.data.userId; // 실제 API에 맞게 조정 필요

        axios
            .get(`http://localhost:8080/api/applications/check`, {
                params: {
                    resumeId: resumeId,
                    jobPostId: jobPostId
                }
            })
            .then((response) => {
                // API 응답 형식에 따라 조정 필요
                // 예시: { applied: true } 형태로 응답이 온다고 가정
                if (response.data && response.data.applied) {
                    setAlreadyApplied(true);
                }
            })
            .catch((error) => {
                console.error("지원 내역 확인 중 오류 발생:", error);
            });
    };

    // 지원하기 함수
    const handleApply = () => {
        if (!isLoggedIn) {
            // 로그인하지 않은 경우
            setModalMessage("로그인 후 이용 가능합니다.");
            setModalType("alert");
            setShowModal(true);
            return;
        }

        if (userType === 'company') {
            // 기업 사용자인 경우
            setModalMessage("기업 회원은 지원할 수 없습니다.");
            setModalType("alert");
            setShowModal(true);
            return;
        }

        if (alreadyApplied) {
            // 이미 지원한 공고인 경우
            setModalMessage("이미 지원한 공고입니다.");
            setModalType("alert");
            setShowModal(true);
            return;
        }

        // 지원 확인 모달 표시
        setModalMessage("정말 이 공고에 지원하시겠습니까?");
        setModalType("confirm");
        setShowModal(true);
    };

    // 지원 확인 처리
    const confirmApply = () => {
        setShowModal(false);

        if (!isLoggedIn || userType !== 'personal' || !userData) {
            return;
        }

        // 개인 사용자의 이력서 ID 또는 사용자 ID 추출 (실제 API에 맞게 조정 필요)
        const resumeId = userData.data.resumeId || userData.data.userId;

        // 지원 프로세스 진행
        const applicationData = {
            jobPostId: jobPostId,
            resumeId: resumeId,
            applicationAt: new Date().toISOString(),
            approveStatus: "PENDING" // 초기 상태는 대기중
        };

        axios
            .post("http://localhost:8080/api/applications", applicationData)
            .then((response) => {
                setAlreadyApplied(true); // 지원 완료 상태로 변경
                setApplicationResult({
                    success: true,
                    message: "지원 성공! 건투를 빕니다."
                });
                setModalType("result");
                setShowModal(true);
            })
            .catch((error) => {
                setApplicationResult({
                    success: false,
                    message: "지원 중 오류가 발생했습니다. 다시 시도해주세요."
                });
                setModalType("result");
                setShowModal(true);
            });
    };

    // 스크랩 토글 함수
    const toggleScrap = () => {
        if (!isLoggedIn) {
            // 로그인하지 않은 경우
            setModalMessage("로그인 후 이용 가능합니다.");
            setModalType("alert");
            setShowModal(true);
            return;
        }

        if (userType !== 'personal') {
            // 개인 사용자가 아닌 경우
            setModalMessage("개인 회원만 스크랩할 수 있습니다.");
            setModalType("alert");
            setShowModal(true);
            return;
        }

        // 실제 API 연동 예시 (현재는 로컬 스토리지로 예시 구현)
        const scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");

        if (isScraped) {
            // 스크랩 취소
            const updatedScraps = scrapedPosts.filter(id => id !== Number(jobPostId));
            localStorage.setItem("scrapedPosts", JSON.stringify(updatedScraps));
            setIsScraped(false);
        } else {
            // 스크랩 추가
            scrapedPosts.push(Number(jobPostId));
            localStorage.setItem("scrapedPosts", JSON.stringify(scrapedPosts));
            setIsScraped(true);
        }
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    if (loading) return <LoadingSpinner message="로딩 중..." fullScreen={false} />
    if (error) return <ErrorMessage message={error} />
    if (!jobPost) return <div className="text-center py-10">해당 공고를 찾을 수 없습니다.</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 relative">
            {/* 스크랩 버튼 (좌측 상단) - 개인 사용자에게만 표시 */}
            {isLoggedIn && userType === 'personal' && (
                <button
                    className={`absolute top-10 left-6 p-2 rounded-full ${isScraped
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200 text-gray-600'}`}
                    onClick={toggleScrap}
                    aria-label={isScraped ? '스크랩 취소' : '스크랩하기'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isScraped ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                {/* 상단: 제목 및 주요 정보 (3개씩 2줄) */}
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

                {/* 중단: 세부 정보 */}
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

                {/* 하단: 이미지 영역 */}
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
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {alreadyApplied ? '지원 완료' : '지원하기'}
                    </button>
                </div>
            </div>

            {/* 모달 */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        {modalType === "confirm" ? (
                            <>
                                <h3 className="text-xl font-semibold mb-4">지원 확인</h3>
                                <p className="mb-6">{modalMessage}</p>
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
                        ) : modalType === "result" ? (
                            <>
                                <h3 className={`text-xl font-semibold mb-4 ${applicationResult?.success ? 'text-green-500' : 'text-red-500'}`}>
                                    {applicationResult?.success ? '지원 완료' : '지원 실패'}
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
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold mb-4">알림</h3>
                                <p className="mb-6">{modalMessage}</p>
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