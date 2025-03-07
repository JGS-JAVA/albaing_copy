import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Pagination from '../../../components/Pagination';
import { formatDate } from '../../../utils/dateUtils';

const JobListTab = ({ jobPosts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const currentJobs = jobPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [jobPosts]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">채용 공고</h2>
                <span className="text-sm text-gray-500">전체 {jobPosts.length}개</span>
            </div>

            {jobPosts.length > 0 ? (
                <div className="space-y-4">
                    {currentJobs.map((job) => (
                        <div
                            key={job.jobPostId}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <Link to={`/jobs/${job.jobPostId}`} className="block">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-blue-600 mb-1">
                                            {job.jobPostTitle}
                                        </h3>
                                        <div className="text-sm text-gray-500 space-y-1">
                                            <p>
                                                <span className="font-medium">직종:</span> {job.jobPostJobCategory}
                                            </p>
                                            <p>
                                                <span className="font-medium">근무형태:</span> {job.jobPostJobType}
                                            </p>
                                            <p>
                                                <span className="font-medium">급여:</span> {job.jobPostSalary}
                                            </p>
                                            <p>
                                                <span className="font-medium">근무지:</span> {job.jobPostWorkPlace}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}>
                                            {job.jobPostStatus && new Date(job.jobPostDueDate) > new Date()
                                                ? "채용중"
                                                : "마감"}
                                        </span>
                                        <span className="text-sm text-gray-500 mt-2">
                                            ~{formatDate(job.jobPostDueDate)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    <Pagination
                        totalItems={jobPosts.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">현재 진행 중인 채용공고가 없습니다.</p>
                </div>
            )}
        </div>
    );
};

export default JobListTab;