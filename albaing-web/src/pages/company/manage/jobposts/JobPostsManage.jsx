import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';

const JobPostsManage = ({ jobPosts, refreshJobPosts }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'closed'
    const [confirmationModal, setConfirmationModal] = useState(null);

    // 채용공고 필터링
    const filteredJobPosts = jobPosts.filter(job => {
        // 검색어 필터링
        const matchesSearch = job.jobPostTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobPostJobCategory.toLowerCase().includes(searchTerm.toLowerCase());

        // 상태 필터링
        const isActive = job.jobPostStatus && new Date(job.jobPostDueDate) > new Date();
        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'active') return matchesSearch && isActive;
        if (filterStatus === 'closed') return matchesSearch && !isActive;

        return matchesSearch;
    });

    // 새 채용공고 등록 페이지로 이동
    const handleCreateJobPost = () => {
        navigate('/jobs/new');
    };

    // 채용공고 상태 변경 (활성화/비활성화)
    const updateJobPostStatus = (jobPostId, currentStatus) => {
        const newStatus = !currentStatus;

        axios.patch(`/api/jobs/${jobPostId}/status?status=${newStatus}`)
            .then(() => {
                refreshJobPosts();
                setConfirmationModal(null);
            })
            .catch(err => {
                console.error('Error updating status:', err);
                alert('상태 변경 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">채용공고 관리</h1>
                <button
                    onClick={handleCreateJobPost}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    새 공고 등록
                </button>
            </div>

            {/* 검색 및 필터 옵션 */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="제목, 직종 검색..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex-none">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">모든 공고</option>
                        <option value="active">활성 공고만</option>
                        <option value="closed">마감된 공고만</option>
                    </select>
                </div>
            </div>

            {/* 채용공고 목록 */}
            {filteredJobPosts.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직종</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">근무 형태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobPosts.map((job) => {
                                const isActive = job.jobPostStatus && new Date(job.jobPostDueDate) > new Date();

                                return (
                                    <tr key={job.jobPostId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link to={`/jobs/${job.jobPostId}`} className="text-blue-600 hover:text-blue-900 font-medium">
                                                {job.jobPostTitle}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.jobPostJobCategory}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.jobPostJobType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(job.jobPostDueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                                >
                                                    {isActive ? '채용중' : '마감'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                                            <button
                                                onClick={() => navigate(`/jobs/edit/${job.jobPostId}`)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => setConfirmationModal({
                                                    jobPostId: job.jobPostId,
                                                    currentStatus: job.jobPostStatus,
                                                    title: job.jobPostTitle
                                                })}
                                                className={`${isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                            >
                                                {isActive ? '마감하기' : '활성화'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500 mb-4">등록된 채용공고가 없거나 검색 조건에 맞는 공고가 없습니다.</p>
                    <button
                        onClick={handleCreateJobPost}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        새 공고 등록하기
                    </button>
                </div>
            )}

            {/* 상태 변경 확인 모달 */}
            {confirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
                        <h3 className="text-lg font-bold mb-4">공고 상태 변경</h3>
                        <p className="mb-6">
                            "{confirmationModal.title}" 공고를
                            {confirmationModal.currentStatus ? ' 마감' : ' 활성화'}
                            하시겠습니까?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmationModal(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => updateJobPostStatus(confirmationModal.jobPostId, confirmationModal.currentStatus)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostsManage;