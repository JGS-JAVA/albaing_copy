import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

// 리뷰 상세 모달
const ReviewDetailModal = ({ isOpen, onClose, review, onEdit, onDelete }) => {
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        if (isOpen && review) {
            fetchComments();
        }
    }, [isOpen, review]);

    // 리뷰에 속한 댓글 목록 가져오기
    const fetchComments = () => {
        setLoadingComments(true);

        axios.get(`/api/admin/reviews/${review.reviewId}/comments`)
            .then(response => {
                setComments(response.data);
                setLoadingComments(false);
            })
            .catch(error => {
                console.error('댓글 로딩 실패:', error);
                setLoadingComments(false);
            });
    };

    // 댓글 삭제 함수
    const handleDeleteComment = (commentId) => {
        if (window.confirm('이 댓글을 삭제하시겠습니까?')) {

            axios.delete(`/api/admin/comments/${commentId}`)
                .then(() => {
                    fetchComments();
                })
                .catch(error => {
                    console.error('댓글 삭제 실패:', error);
                });
        }
    };

    if (!isOpen || !review) return null;

    // 날짜 포맷 변환
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b flex justify-between items-center sticky top-0 bg-white">
                    <h3 className="text-xl font-semibold text-gray-800">리뷰 상세 정보</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold text-gray-800">{review.reviewTitle}</h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(review)}
                                    className="px-3 py-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded text-sm"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => onDelete(review)}
                                    className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-sm"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center text-sm text-gray-500 mb-4">
                            <div>작성자: {review.userName}</div>
                            <div className="mx-2">•</div>
                            <div>기업: {review.companyName}</div>
                            <div className="mx-2">•</div>
                            <div>작성일: {formatDate(review.reviewCreatedAt)}</div>
                            {review.reviewUpdatedAt && (
                                <>
                                    <div className="mx-2">•</div>
                                    <div>수정일: {formatDate(review.reviewUpdatedAt)}</div>
                                </>
                            )}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                            {review.reviewContent}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold mb-4">댓글 ({comments.length})</h3>

                        {loadingComments ? (
                            <div className="text-center py-4">
                                <LoadingSpinner message="댓글을 불러오는 중..." fullScreen={false} />
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between">
                                            <div className="font-medium text-gray-800">{comment.userName}</div>
                                            <button
                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">
                                            {formatDate(comment.commentCreatedAt)}
                                            {comment.commentUpdatedAt && ` (수정됨: ${formatDate(comment.commentUpdatedAt)})`}
                                        </div>
                                        <div className="text-gray-700">
                                            {comment.commentContent}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                댓글이 없습니다.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 리뷰 수정 모달
const ReviewEditModal = ({ isOpen, onClose, review, onUpdate }) => {
    const [formData, setFormData] = useState({
        reviewTitle: '',
        reviewContent: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (review) {
            setFormData({
                reviewTitle: review.reviewTitle || '',
                reviewContent: review.reviewContent || ''
            });
        }
    }, [review]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.reviewTitle.trim()) {
            newErrors.reviewTitle = '제목을 입력해주세요';
        }
        if (!formData.reviewContent.trim()) {
            newErrors.reviewContent = '내용을 입력해주세요';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onUpdate({
                ...review,
                reviewTitle: formData.reviewTitle,
                reviewContent: formData.reviewContent
            });
        }
    };

    if (!isOpen || !review) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">리뷰 수정</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="reviewTitle"
                            name="reviewTitle"
                            value={formData.reviewTitle}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${errors.reviewTitle ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="리뷰 제목"
                        />
                        {errors.reviewTitle && (
                            <p className="mt-1 text-sm text-red-500">{errors.reviewTitle}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700 mb-2">
                            내용 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="reviewContent"
                            name="reviewContent"
                            value={formData.reviewContent}
                            onChange={handleChange}
                            rows={10}
                            className={`w-full p-3 border rounded-lg ${errors.reviewContent ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="리뷰 내용"
                        ></textarea>
                        {errors.reviewContent && (
                            <p className="mt-1 text-sm text-red-500">{errors.reviewContent}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedReview, setSelectedReview] = useState(null);
    const [filters, setFilters] = useState({
        userName: '',
        companyName: '',
        reviewTitle: ''
    });
    const [sortField, setSortField] = useState('reviewCreatedAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // 모달 상태 관리
    const detailModal = useModal();
    const editModal = useModal();
    const deleteModal = useModal();

    // 리뷰 목록 가져오기
    const fetchReviews = () => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/reviews', {
            params: {
                userName: filters.userName,
                companyName: filters.companyName,
                reviewTitle: filters.reviewTitle,
                sortOrderBy: sortField,
                isDESC: sortDirection === 'desc'
            }
        })
            .then(response => {
                setReviews(response.data);
                setTotalItems(response.data.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('리뷰 목록 로딩 실패:', error);
                setError('리뷰 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReviews();
    }, [sortField, sortDirection]);

    // 리뷰 삭제
    const handleDeleteReview = () => {
        if (!selectedReview) return;

        setLoading(true);

        axios.delete(`/api/admin/reviews/${selectedReview.reviewId}`)
            .then(() => {
                fetchReviews();
                deleteModal.closeModal();
                setSelectedReview(null);
            })
            .catch(error => {
                console.error('리뷰 삭제 실패:', error);
                setError('리뷰 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    // 리뷰 수정
    const handleUpdateReview = (updatedReview) => {
        setLoading(true);

        axios.put(`/api/admin/reviews/${updatedReview.reviewId}`, {
            reviewTitle: updatedReview.reviewTitle,
            reviewContent: updatedReview.reviewContent
        })
            .then(() => {
                fetchReviews();
                editModal.closeModal();
                detailModal.closeModal();
                setSelectedReview(null);
            })
            .catch(error => {
                console.error('리뷰 수정 실패:', error);
                setError('리뷰 수정에 실패했습니다.');
                setLoading(false);
            });
    };

    // 리뷰 상세 보기
    const handleViewReview = (review) => {
        setSelectedReview(review);
        detailModal.openModal();
    };

    // 리뷰 수정 모달 열기
    const handleOpenEditModal = (review) => {
        setSelectedReview(review);
        editModal.openModal();
    };

    // 리뷰 삭제 모달 열기
    const handleOpenDeleteModal = (review) => {
        setSelectedReview(review);
        deleteModal.openModal();
    };

    // 검색 필터 적용
    const handleSearch = (e) => {
        e.preventDefault();
        fetchReviews();
    };

    // 필터 변경 핸들러
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 정렬 변경 핸들러
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 현재 페이지의 리뷰 목록
    const getCurrentReviews = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return reviews.slice(indexOfFirstItem, indexOfLastItem);
    };

    // 정렬 아이콘 표시
    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const summarizeContent = (content, maxLength = 50) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">리뷰 관리</h1>
                <p className="text-gray-600 mt-1">사용자가 작성한 기업 리뷰를 관리할 수 있습니다.</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">작성자명</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={filters.userName}
                            onChange={handleFilterChange}
                            placeholder="작성자명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">기업명</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={filters.companyName}
                            onChange={handleFilterChange}
                            placeholder="기업명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-1">리뷰 제목</label>
                        <input
                            type="text"
                            id="reviewTitle"
                            name="reviewTitle"
                            value={filters.reviewTitle}
                            onChange={handleFilterChange}
                            placeholder="리뷰 제목 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="md:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="리뷰 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('reviewId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'reviewId' && renderSortIcon('reviewId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('userName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            작성자 {renderSortIcon('userName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            기업명 {renderSortIcon('companyName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('reviewTitle')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            리뷰 제목 {renderSortIcon('reviewTitle')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        리뷰 내용
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('reviewCreatedAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            작성일 {renderSortIcon('reviewCreatedAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentReviews().length > 0 ? (
                                    getCurrentReviews().map((review) => (
                                        <tr key={review.reviewId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {review.reviewId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {review.userName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {review.companyName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                <button
                                                    onClick={() => handleViewReview(review)}
                                                    className="hover:text-blue-600 hover:underline"
                                                >
                                                    {review.reviewTitle}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {summarizeContent(review.reviewContent)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(review.reviewCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewReview(review)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEditModal(review)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        수정
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(review)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* 리뷰 상세 모달 */}
            <ReviewDetailModal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                review={selectedReview}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
            />

            {/* 리뷰 수정 모달 */}
            <ReviewEditModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
                review={selectedReview}
                onUpdate={handleUpdateReview}
            />

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteReview}
                title="리뷰 삭제"
                message={`'${selectedReview?.reviewTitle}' 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminReviews;