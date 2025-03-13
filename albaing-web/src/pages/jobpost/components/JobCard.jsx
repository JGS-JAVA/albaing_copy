import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({
                     job,
                     company,
                     isScraped,
                     isLoggedIn,
                     userType,
                     toggleScrap,
                     formatDate
                 }) => {

    const isActive = new Date(job.jobPostDueDate) > new Date() && (job.jobPostStatus !== false);


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 relative h-full">
            {/* 스크랩 버튼 */}
            {isLoggedIn && userType === "personal" && (
                <button
                    onClick={(e) => toggleScrap(job.jobPostId)}
                    className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-200 
                    ${isScraped ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
                    `}
                    style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    aria-label={isScraped ? "스크랩 취소" : "스크랩하기"}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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

            {/* 모집 상태 뱃지 */}
            <div className="absolute top-4 left-4 z-20">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                    {isActive ? "채용중" : "마감"}
                </span>
            </div>

            <Link to={`/jobs/${job.jobPostId}`} className="block h-full">
                {/* 회사 이미지 영역 - 큰 이미지 */}
                <div className="relative w-full h-48">
                    {company.companyImage ? (
                        <img
                            src={company.companyImage}
                            alt={company.companyName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/400x200/e6f7ff/0072b1?text=${encodeURIComponent(company.companyName)}`;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                                    <span className="text-blue-600 text-3xl font-bold">{company.companyName.charAt(0)}</span>
                                </div>
                                <p className="mt-2 text-gray-700 font-medium">{company.companyName}</p>
                            </div>
                        </div>
                    )}

                    {/* 이미지 위에 쓰는 회사명과 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div className="p-4 w-full">
                            <p className="text-white text-lg font-semibold truncate">{company.companyName}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                {job.jobPostJobCategory || "미분류"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 공고 내용 영역 */}
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {job.jobPostTitle || '제목 없음'}
                    </h3>

                    <div className="mt-3 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{job.jobPostWorkPlace || '위치 미정'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate font-medium">{job.jobPostSalary || '급여 미정'}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{job.jobWorkSchedule || '근무일'}, {job.jobPostShiftHours || '근무시간'}</span>
                        </div>
                    </div>
                </div>

                {/* 날짜 정보 영역 */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div>등록일: {formatDate(job.jobPostCreatedAt)}</div>
                        <div className={isActive ? "text-red-600 font-medium" : "text-gray-500"}>
                            마감일: {formatDate(job.jobPostDueDate)}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default JobCard;