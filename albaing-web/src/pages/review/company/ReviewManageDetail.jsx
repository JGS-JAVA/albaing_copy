import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const CompanyReviewManagementDetail = () => {
    const { companyId, reviewId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType, userData } = useAuth();

    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        loadReviewData();
    }, [companyId, reviewId, isLoggedIn, userType, userData, navigate]);

    const loadReviewData = () => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`, { withCredentials: true })
            .then((res) => {
                setReview(res.data);
                setComments(res.data.comments || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("리뷰 데이터를 가져오는 중 오류 발생:", err);
                setError("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentInput.trim()) return;

        axios.post(`/api/companies/${companyId}/reviews/${reviewId}/comments`, {
            commentContent: commentInput
        }, { withCredentials: true })
            .then(() => {
                loadReviewData();
                setCommentInput("");
            })
            .catch(error => {
                console.error("댓글 작성 중 오류 발생:", error);
                setError("댓글 작성 중 오류가 발생했습니다.");
            });
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
            axios.delete(`/api/companies/${companyId}/reviews/${reviewId}/comments/${commentId}`, {
                withCredentials: true
            })
                .then(() => {
                    loadReviewData();
                })
                .catch(error => {
                    console.error("댓글 삭제 중 오류 발생:", error);
                    setError("댓글 삭제 중 오류가 발생했습니다.");
                });
        }
    };

    const handleDeleteReview = () => {
        if (window.confirm("정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            axios.delete(`/api/companies/${companyId}/reviews/${reviewId}`, {
                withCredentials: true
            })
                .then(() => {
                    alert("리뷰가 성공적으로 삭제되었습니다.");
                    navigate(`/company/manage/${companyId}`);
                })
                .catch(error => {
                    console.error("리뷰 삭제 중 오류 발생:", error);
                    setError("리뷰 삭제 중 오류가 발생했습니다.");
                });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p>{error}</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => navigate(`/company/manage/${companyId}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        회사 대시보드로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (!review) {
        return <div className="flex justify-center items-center h-screen">리뷰를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <button
                    onClick={() => navigate(`/company/manage/${companyId}`)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    &larr; 회사 대시보드로 돌아가기
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* 리뷰 헤더 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-gray-800">{review.reviewTitle}</h1>
                        <button
                            onClick={handleDeleteReview}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            리뷰 삭제
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        작성일: {new Date(review.reviewCreatedAt).toLocaleString()}
                    </p>
                </div>

                {/* 리뷰 내용 */}
                <div className="p-6 border-b border-gray-200">
                    <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-line">{review.reviewContent}</p>
                    </div>
                </div>

                {/* 댓글 섹션 */}
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">댓글 ({comments.length})</h2>

                    {/* 댓글 목록 */}
                    {comments.length > 0 ? (
                        <ul className="space-y-4 mb-6">
                            {comments.map((comment) => (
                                <li key={comment.commentId} className="bg-gray-50 p-4 rounded">
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-500">
                                            {new Date(comment.commentCreatedAt).toLocaleString()}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteComment(comment.commentId)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                    <p className="mt-2 text-gray-700">{comment.commentContent}</p>
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
        </div>
    );
};

export default CompanyReviewManagementDetail;