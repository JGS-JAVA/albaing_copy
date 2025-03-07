import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ReviewManagement = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType, userData } = useAuth();

    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmDeleteComment, setConfirmDeleteComment] = useState(null);

    // 리뷰 목록 불러오기
    const fetchReviews = () => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/my-reviews`, {
            withCredentials: true
        })
            .then(response => {
                setReviews(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('리뷰 데이터를 가져오는 중 오류 발생:', err);
                setError('리뷰를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    };

    // 특정 리뷰 상세 정보 불러오기
    const fetchReviewDetails = (reviewId) => {
        setLoading(true);
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`, {
            withCredentials: true
        })
            .then(response => {
                setSelectedReview(response.data);
                setComments(response.data.comments || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('리뷰 상세 정보를 가져오는 중 오류 발생:', err);
                setError('리뷰 상세 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    };

    // 권한 체크 및 초기 데이터 로딩
    useEffect(() => {
        // 아직 로그인 상태를 확인할 수 없는 경우
        if (isLoggedIn === null || userData === null) return;

        // 로그인 여부 체크
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // 기업 사용자 여부 체크
        if (userType !== 'company') {
            navigate('/');
            return;
        }

        // 본인 회사인지 체크
        if (userData && userData.companyId && parseInt(companyId) !== userData.companyId) {
            navigate(`/company/manage/${userData.companyId}`);
            return;
        }

        // 리뷰 목록 불러오기
        fetchReviews();
    }, [companyId, isLoggedIn, navigate, userData, userType]);

    // 댓글 작성
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentInput.trim() || !selectedReview) return;

        axios.post(`/api/companies/${companyId}/reviews/${selectedReview.reviewId}/comments`, {
            commentContent: commentInput
        }, { withCredentials: true })
            .then(() => {
                // 새로고침하여 새 댓글 반영
                fetchReviewDetails(selectedReview.reviewId);
                setCommentInput('');
            })
            .catch(error => {
                console.error('댓글 작성 중 오류 발생:', error);
                setError('댓글 작성 중 오류가 발생했습니다.');
            });
    };

    // 리뷰 삭제
    const handleDeleteReview = (reviewId) => {
        axios.delete(`/api/companies/${companyId}/reviews/${reviewId}`, {
            withCredentials: true
        })
            .then(() => {
                // 리뷰 목록 갱신
                fetchReviews();

                // 현재 선택된 리뷰가 삭제된 리뷰라면 선택 해제
                if (selectedReview && selectedReview.reviewId === reviewId) {
                    setSelectedReview(null);
                }

                setConfirmDelete(null);
            })
            .catch(error => {
                console.error('리뷰 삭제 중 오류 발생:', error);
                setError('리뷰 삭제 중 오류가 발생했습니다.');
            });
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId) => {
        if (!selectedReview) return;

        axios.delete(`/api/companies/${companyId}/reviews/${selectedReview.reviewId}/comments/${commentId}`, {
            withCredentials: true
        })
            .then(() => {
                // 댓글 목록 갱신
                fetchReviewDetails(selectedReview.reviewId);
                setConfirmDeleteComment(null);
            })
            .catch(error => {
                console.error('댓글 삭제 중 오류 발생:', error);
                setError('댓글 삭제 중 오류가 발생했습니다.');
            });
    };

    // 선택된 리뷰 변경
    const handleSelectReview = (review) => {
        if (selectedReview && selectedReview.reviewId === review.reviewId) {
            setSelectedReview(null);
        } else {
            fetchReviewDetails(review.reviewId);
        }
    };

    // 로딩 중 표시
    if (loading && !reviews.length) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">회사 리뷰 관리</h1>
                <p className="text-gray-600 mt-2">직원들이 남긴 리뷰를 확인하고 관리할 수 있습니다.</p>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {/* 리뷰 목록 섹션 */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-semibold mb-4">리뷰 목록</h2>

                        {reviews.length === 0 ? (
                            <p className="text-gray-500 py-4">아직 등록된 리뷰가 없습니다.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {reviews.map((review) => (
                                    <li
                                        key={review.reviewId}
                                        className={`py-4 cursor-pointer hover:bg-gray-50 ${selectedReview?.reviewId === review.reviewId ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleSelectReview(review)}
                                    >
                                        <h3 className="text-lg font-medium text-gray-900 truncate">{review.reviewTitle}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(review.reviewCreatedAt).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* 리뷰 상세 섹션 */}
                <div className="w-full md:w-2/3">
                    {selectedReview ? (
                        <div className="bg-white rounded-lg shadow">
                            {/* 리뷰 내용 */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedReview.reviewTitle}</h2>
                                    <button
                                        onClick={() => setConfirmDelete(selectedReview.reviewId)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        리뷰 삭제
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">
                                    작성일: {new Date(selectedReview.reviewCreatedAt).toLocaleString()}
                                </p>
                                <div className="mt-4 prose max-w-none">
                                    <p className="text-gray-700 whitespace-pre-line">{selectedReview.reviewContent}</p>
                                </div>
                            </div>

                            {/* 댓글 섹션 */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>

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
                                                        onClick={() => setConfirmDeleteComment(comment.commentId)}
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
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">왼쪽 목록에서 리뷰를 선택하여 상세 내용을 확인하세요.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 리뷰 삭제 확인 모달 */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4">리뷰 삭제 확인</h3>
                        <p className="mb-6">정말로 이 리뷰를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDeleteReview(confirmDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 댓글 삭제 확인 모달 */}
            {confirmDeleteComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4">댓글 삭제 확인</h3>
                        <p className="mb-6">정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setConfirmDeleteComment(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDeleteComment(confirmDeleteComment)}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;