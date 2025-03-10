import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChatBubbleLeftIcon,
    TrashIcon,
    ChatBubbleLeftRightIcon,
    XMarkIcon,
    PaperAirplaneIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const ReviewManage = ({ companyId, reviews, refreshReviews }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmDeleteComment, setConfirmDeleteComment] = useState(null);

    // 리뷰 필터링
    const filteredReviews = reviews.filter(review =>
        review.reviewTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewContent?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 특정 리뷰의 상세 정보 및 댓글 불러오기
    const fetchReviewDetails = (reviewId) => {
        setLoading(true);
        setError(null);

        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`, { withCredentials: true })
            .then(response => {
                setSelectedReview(response.data);
                setComments(response.data.comments || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('리뷰 상세 정보를 가져오는 중 오류 발생:', err);
                setError('리뷰 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    };

    // 리뷰 선택 변경
    const handleSelectReview = (review) => {
        if (selectedReview && selectedReview.reviewId === review.reviewId) {
            setSelectedReview(null);
            setComments([]);
        } else {
            fetchReviewDetails(review.reviewId);
        }
    };

    // 댓글 작성
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentInput.trim() || !selectedReview) return;

        setLoading(true);

        axios.post(`/api/companies/${companyId}/reviews/${selectedReview.reviewId}/comments`, {
            reviewId: selectedReview.reviewId,
            commentContent: commentInput
        }, { withCredentials: true })
            .then(() => {
                fetchReviewDetails(selectedReview.reviewId);
                setCommentInput('');
            })
            .catch(error => {
                console.error('댓글 작성 중 오류 발생:', error);
                setError('댓글 작성 중 오류가 발생했습니다.');
                setLoading(false);
            });
    };

    // 리뷰 삭제
    const handleDeleteReview = (reviewId) => {
        setLoading(true);

        axios.delete(`/api/companies/${companyId}/reviews/${reviewId}`, { withCredentials: true })
            .then(() => {
                if (selectedReview && selectedReview.reviewId === reviewId) {
                    setSelectedReview(null);
                    setComments([]);
                }
                refreshReviews();
                setConfirmDelete(null);
                setLoading(false);
            })
            .catch(error => {
                console.error('리뷰 삭제 중 오류 발생:', error);
                setError('리뷰 삭제 중 오류가 발생했습니다.');
                setConfirmDelete(null);
                setLoading(false);
            });
    };

    // 댓글 삭제
    const handleDeleteComment = (commentId) => {
        if (!selectedReview) return;

        setLoading(true);

        axios.delete(`/api/companies/${companyId}/reviews/${selectedReview.reviewId}/comments/${commentId}`, {
            withCredentials: true
        })
            .then(() => {
                fetchReviewDetails(selectedReview.reviewId);
                setConfirmDeleteComment(null);
            })
            .catch(error => {
                console.error('댓글 삭제 중 오류 발생:', error);
                setError('댓글 삭제 중 오류가 발생했습니다.');
                setConfirmDeleteComment(null);
                setLoading(false);
            });
    };

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">리뷰 관리</h1>
                <button
                    onClick={refreshReviews}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    새로고침
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* 검색 필드 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="리뷰 제목, 내용 검색..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* 리뷰 목록 */}
                <div className="w-full lg:w-2/5">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold flex items-center">
                                <ChatBubbleLeftIcon className="h-5 w-5 mr-2 text-blue-500" />
                                리뷰 목록
                                <span className="ml-2 text-sm text-gray-500">
                                    총 {filteredReviews.length}개
                                </span>
                            </h2>
                        </div>

                        {filteredReviews.length > 0 ? (
                            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                                {filteredReviews.map((review) => (
                                    <div
                                        key={review.reviewId}
                                        className={`p-4 cursor-pointer transition-colors ${
                                            selectedReview?.reviewId === review.reviewId
                                                ? 'bg-blue-50'
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleSelectReview(review)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-900 mb-1">{review.reviewTitle}</h3>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDelete(review);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{review.reviewContent}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            작성일: {formatDate(review.reviewCreatedAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">등록된 리뷰가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 리뷰 상세 정보 */}
                <div className="w-full lg:w-3/5">
                    {selectedReview ? (
                        <div className="bg-white rounded-lg shadow-md">
                            {/* 리뷰 내용 */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{selectedReview.reviewTitle}</h2>
                                    <button
                                        onClick={() => setConfirmDelete(selectedReview)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">
                                    작성일: {formatDate(selectedReview.reviewCreatedAt)}
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-line">{selectedReview.reviewContent}</p>
                                </div>
                            </div>

                            {/* 댓글 섹션 */}
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-500" />
                                    댓글 {comments.length}개
                                </h3>

                                {/* 댓글 목록 */}
                                {comments.length > 0 ? (
                                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                                        {comments.map((comment) => (
                                            <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(comment.commentCreatedAt)}
                                                    </p>
                                                    <button
                                                        onClick={() => setConfirmDeleteComment(comment)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <p className="mt-2 text-gray-700">{comment.commentContent}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 mb-6">아직 댓글이 없습니다.</p>
                                )}

                                {/* 댓글 작성 폼 */}
                                <form onSubmit={handleCommentSubmit} className="mt-4">
                                    <div className="flex mb-3">
                                        <input
                                            type="text"
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            placeholder="댓글을 작성하세요..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                            disabled={!commentInput.trim() || loading}
                                        >
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        * 댓글은 기업 계정으로 작성됩니다.
                                    </p>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <ChatBubbleLeftIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">왼쪽 목록에서 리뷰를 선택하여 상세 내용을 확인하세요.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 리뷰 삭제 확인 모달 */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-red-600 mb-4">리뷰 삭제 확인</h3>
                        <p className="mb-6">
                            "{confirmDelete.reviewTitle}" 리뷰를 정말로 삭제하시겠습니까?
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDeleteReview(confirmDelete.reviewId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={loading}
                            >
                                {loading ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 댓글 삭제 확인 모달 */}
            {confirmDeleteComment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-red-600 mb-4">댓글 삭제 확인</h3>
                        <p className="mb-6">
                            정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmDeleteComment(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDeleteComment(confirmDeleteComment.commentId)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                disabled={loading}
                            >
                                {loading ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManage;