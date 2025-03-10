import React from 'react';
import { Link } from 'react-router-dom';
import {
    BriefcaseIcon,
    UserGroupIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const DashboardOverview = ({ companyData, jobPosts, applications, reviews }) => {
    // 활성화된 채용공고 수 계산
    const activeJobPostsCount = jobPosts.filter(
        job => job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
    ).length;

    // 확인하지 않은 신규 지원자 수 (임시로 전체 지원자 수로 설정)
    const newApplicationsCount = applications.length;

    // 최근 추가된 리뷰 수 (임시로 전체 리뷰 수로 설정)
    const recentReviewsCount = reviews.length;

    // 최근 채용공고만 필터링 (최대 5개)
    const recentJobPosts = [...jobPosts]
        .sort((a, b) => new Date(b.jobPostCreatedAt) - new Date(a.jobPostCreatedAt))
        .slice(0, 5);

    // 최근 지원자만 필터링 (최대 5개)
    const recentApplications = [...applications]
        .sort((a, b) => new Date(b.applicationAt) - new Date(a.applicationAt))
        .slice(0, 5);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">기업 대시보드</h1>

            {/* 주요 지표 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="활성 채용공고"
                    value={activeJobPostsCount}
                    icon={<BriefcaseIcon className="h-7 w-7 text-blue-600" />}
                    linkTo="/company/manage/jobs"
                    linkText="채용공고 관리"
                />

                <StatCard
                    title="전체 지원자 수"
                    value={applications.length}
                    icon={<UserGroupIcon className="h-7 w-7 text-green-600" />}
                    linkTo="/company/manage/applications"
                    linkText="지원자 관리"
                />

                <StatCard
                    title="신규 지원자"
                    value={newApplicationsCount}
                    icon={<ClockIcon className="h-7 w-7 text-amber-600" />}
                    linkTo="/company/manage/applications"
                    linkText="지원자 확인"
                />

                <StatCard
                    title="기업 리뷰"
                    value={recentReviewsCount}
                    icon={<ChatBubbleLeftRightIcon className="h-7 w-7 text-purple-600" />}
                    linkTo="/company/manage/reviews"
                    linkText="리뷰 관리"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 최근 채용공고 목록 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">최근 채용공고</h3>
                        <Link
                            to="/jobs/new"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            +새 공고 추가
                        </Link>
                    </div>
                    <div className="p-6">
                        {recentJobPosts.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {recentJobPosts.map((job) => (
                                    <div key={job.jobPostId} className="py-3 flex justify-between items-center">
                                        <div>
                                            <Link
                                                to={`/jobs/${job.jobPostId}`}
                                                className="font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                {job.jobPostTitle}
                                            </Link>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {job.jobPostJobCategory} · 마감일: {new Date(job.jobPostDueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }
                                            `}>
                                                {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                    ? '채용중'
                                                    : '마감'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">등록된 채용공고가 없습니다.</p>
                                <Link
                                    to="/jobs/new"
                                    className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                >
                                    새 공고 등록하기
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 최근 지원자 목록 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-800">최근 지원자</h3>
                    </div>
                    <div className="p-6">
                        {recentApplications.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {recentApplications.map((app) => (
                                    <div key={app.jobApplicationId} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{app.applicantName}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {app.jobPostTitle} · {new Date(app.applicationAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`
                                                px-2 py-1 rounded-full text-xs font-medium
                                                ${app.approveStatus === 'approving'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : app.approveStatus === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }
                                            `}>
                                                {app.approveStatus === 'approving'
                                                    ? '검토중'
                                                    : app.approveStatus === 'approved'
                                                        ? '합격'
                                                        : '불합격'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">아직 지원자가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 통계 카드 컴포넌트
const StatCard = ({ title, value, icon, linkTo, linkText }) => (
    <div className="bg-white rounded-lg shadow p-6 transition-transform hover:scale-102 hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
            <div className="rounded-full bg-blue-50 p-3">
                {icon}
            </div>
            <div className="text-3xl font-bold text-gray-800">
                {value}
            </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {linkTo && (
            <Link to={linkTo} className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium inline-block">
                {linkText} &rarr;
            </Link>
        )}
    </div>
);

export default DashboardOverview;