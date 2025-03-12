import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorMessage, LoadingSpinner} from "../../components";
import {useModal,AlertModal} from "../../components";

const ReviewDetail = () => {
    const {companyId, reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const [editReviewId, setEditReviewId] = useState(null);
    const [editReviewContent, setEditReviewContent] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const navigate = useNavigate();
  
    const alertModal = useModal();

    // 조회한 리뷰 내용 불러오기
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then((res) => {
                // 응답 데이터 확인 및 처리
                console.log("리뷰 조회 응답:", res.data);

                // 리뷰 데이터 설정
                const reviewData = {
                    reviewId: res.data.reviewId,
                    userId: res.data.userId,
                    companyId: res.data.companyId || companyId, // companyId가 null이면 URL의 companyId 사용
                    reviewTitle: res.data.reviewTitle,
                    reviewContent: res.data.reviewContent,
                    reviewCreatedAt: res.data.reviewCreatedAt,
                    reviewUpdatedAt: res.data.reviewUpdatedAt
                };

                setReview(reviewData);

                // 댓글 설정
                if (Array.isArray(res.data.comments)) {
                    setComments(res.data.comments);
                } else {
                    setComments([]);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("리뷰 데이터를 가져오는 중 오류 발생:", err);
                setError("리뷰를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [reviewId, companyId]);

    // 댓글 작성
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        try {
            // 요청 데이터 로깅
            console.log("댓글 작성 요청 데이터:", {
                reviewId: parseInt(reviewId),
                commentContent: commentInput
            });

            // 댓글 작성 API 호출
            await axios.post(`/api/companies/${companyId}/reviews/${reviewId}/comments`, {
                reviewId: parseInt(reviewId),
                commentContent: commentInput
            }, {
                withCredentials: true
            });

            // 성공 메시지 표시
            console.log("댓글이 성공적으로 작성되었습니다.");

            // 댓글 작성 후 리뷰 데이터 다시 불러오기
            const res = await axios.get(`/api/companies/${companyId}/reviews/${reviewId}`);

            // 응답 데이터 확인
            console.log("리뷰 데이터 새로 불러옴:", res.data);

            // 리뷰 데이터 설정
            const reviewData = {
                reviewId: res.data.reviewId,
                userId: res.data.userId,
                companyId: res.data.companyId || companyId,
                reviewTitle: res.data.reviewTitle,
                reviewContent: res.data.reviewContent,
                reviewCreatedAt: res.data.reviewCreatedAt,
                reviewUpdatedAt: res.data.reviewUpdatedAt
            };

            setReview(reviewData);

            // 댓글 설정
            if (Array.isArray(res.data.comments)) {
                setComments(res.data.comments);
            } else {
                // 새로운 댓글이 있을 경우, 현재 댓글 목록에 추가
                const newComment = {
                    commentId: Date.now(), // 임시 ID
                    commentContent: commentInput,
                    commentCreatedAt: new Date().toISOString()
                };

                setComments(prevComments => [...prevComments, newComment]);
            }

            // 입력 필드 초기화
            setCommentInput("");
        } catch (error) {
            console.error("댓글 작성 중 오류 발생:", error);
            console.error("오류 응답:", error.response);

            if (error.response?.status === 401) {
                alertModal.openModal({
                    title: '로그인 필요',
                    message: '댓글을 작성하려면 로그인이 필요합니다.',
                    type: 'info'
                });
            } else {
                alertModal.openModal({
                    title: '오류',
                    message: '댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.',
                    type: 'warning',
                });
            }
        }
    };

    //리뷰 수정
    const handleReviewUpdate = () => {
        axios.put(`/api/reviews/${reviewId}`, {
            reviewContent: editReviewContent
        })
            .then(() => {
                    // 수정된 리뷰 내용을 상태에 바로 반영
                    setReview(preReview => ({
                        ...preReview,
                        reviewContent: editReviewContent,
                        reviewUpdatedAt: new Date().toISOString() // 수정된 시간 갱신
                    }));
                    // 수정이 끝난 후 텍스트 영역을 비움
                    setEditReviewId(null);
                    setEditReviewContent('');

            })
            .catch((err) => {
                alert("리뷰 수정 도중 오류가 발생했습니다. 다시 시도해주세요.");
                console.error("Error : ", err);
            });
    };

    //리뷰 삭제
    const handleReviewDelete = () => {
        if (!window.confirm("정말로 리뷰를 삭제하시겠습니까?")) return;

        axios.delete(`/api/reviews/${reviewId}`,
            { withCredentials: true })
            .then(() => {
                alert("리뷰가 삭제되었습니다.");

                // 현재 상태에서 리뷰 데이터를 제거
                setReview(null);

                // 이전 페이지로 이동
                navigate(-1);
            })
            .catch((err) => {
                alert("리뷰 삭제 도중 오류가 발생했습니다. 다시 시도해주세요.");
                console.error("Error:", err);
            });
    };

    //댓글 수정
    const handleCommentEdit = (commentId) => {
        if (!editCommentContent.trim()) return;

        axios.put(`/api/reviews/${reviewId}/comments/${commentId}`, {
            commentContent: editCommentContent
        }, { withCredentials: true })
            .then(() => {
                axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
                    .then((res) => {
                        setComments(res.data.comments || []);
                        setEditCommentId(null);
                    })
                    .catch((err) => {
                        alert("댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
                        console.error("Error : ", err);
                    });
            })
            .catch((err) => {
                alert("댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
                console.error("Error : ", err);
            });
    }

    //댓글 삭제
    const handleCommentDelete = (commentId) => {
        if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) return;

        axios.delete(`/api/reviews/${reviewId}/comments/${commentId}`,
            { withCredentials: true })
            .then(() => {
                setComments(comments.filter(comment => comment.commentId !== commentId));
            })
            .catch((err) => {
                alert("댓글 삭제 도중 오류가 발생했습니다. 다시 시도해주세요.");
                console.error("Error : ", err);
            });
    }

    if (loading) return <LoadingSpinner message="로딩 중..." />
    if (error) return <ErrorMessage message={error} />
    if (!review) return <div className="text-center py-10">리뷰를 찾을 수 없습니다.</div>


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* 리뷰 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{review.reviewTitle}</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            작성일: {new Date(review.reviewCreatedAt).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setEditReviewId(review.reviewId);
                                setEditReviewContent(review.reviewContent);
                            }}
                        >
                            수정
                        </button>
                        <button onClick={() => handleReviewDelete(reviewId)}>리뷰 삭제</button>
                    </div>
                </div>


                {/* 리뷰 내용 */}
                <div className="p-6 border-b border-gray-200">
                    {editReviewId === review.reviewId ? (
                        <div>
                            <textarea
                                value={editReviewContent}
                                onChange={(e) => setEditReviewContent(e.target.value)}
                            ></textarea>
                            <div>
                                <button onClick={handleReviewUpdate}>저장</button>
                                <button onClick={() => setEditReviewId(null)}>취소</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-line">{review.reviewContent}</p>
                    )}
                </div>

                {/* 댓글 섹션 */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h2>

                    {/* 댓글 목록 */}
                    {comments.length > 0 ? (
                        <ul className="space-y-4 mb-6">
                            {comments.map((comment) => (
                                <li key={comment.commentId} className="bg-gray-50 p-4 rounded">
                                    <p className="text-sm text-gray-500">
                                        {new Date(comment.commentCreatedAt).toLocaleString()}
                                    </p>
                                    {editCommentId === comment.commentId ? (
                                        <div>
                                            <textarea
                                                value={editCommentContent}
                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                            ></textarea>
                                            <button onClick={() => handleCommentEdit(comment.commentId)}>저장</button>
                                            <button onClick={() => setEditCommentId(null)}>취소</button>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-gray-700">{comment.commentContent}</p>
                                    )}
                                    <div className>
                                        <button onClick={() => {
                                            setEditCommentId(comment.commentId);
                                            setEditCommentContent(comment.commentContent);
                                        }}>수정
                                        </button>
                                        <button onClick={() => handleCommentDelete(comment.commentId)}>삭제</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mb-6">아직 댓글이 없습니다.</p>
                    )}

                    {/* 댓글 작성 폼 */}
                    <form onSubmit={handleCommentSubmit} className="mt-4">
                        <div className="flex flex-col space-y-2">
                            <textarea
                                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                                rows="3"
                                placeholder="댓글을 작성하세요..."
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                            ></textarea>
                            <button
                                type="submit"
                                className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                            >
                                댓글 작성
                            </button>
                        </div>
                    </form>
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

export default ReviewDetail;