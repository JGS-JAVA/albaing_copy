import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CompanyHeader from './CompanyHeader';
import CompanyTabs from './CompanyTabs';
import CompanyInfoTab from './CompanyInfoTab';
import JobListTab from './JobListTab';
import ReviewListTab from './ReviewListTab';
import apiCompanyService from '../../../service/apiCompanyService';

const CompanyDetail = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Promise 체이닝을 사용한 데이터 로딩
        apiCompanyService.getCompanyInfo(companyId)
            .then(companyData => {
                setCompany(companyData);
                return apiCompanyService.getJobPostsByCompanyId(companyId);
            })
            .then(jobPostsData => {
                setJobPosts(jobPostsData);
                return apiCompanyService.getReviewsByCompanyId(companyId);
            })
            .then(reviewsData => {
                setReviews(reviewsData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다');
                setLoading(false);
            });
    }, [companyId]);

    // 새 리뷰가 추가되면 리뷰 목록 새로고침
    const handleReviewAdded = (reviewData) => {
        return apiCompanyService.addReview(companyId, reviewData)
            .then(() => apiCompanyService.getReviewsByCompanyId(companyId))
            .then(updatedReviews => {
                setReviews(updatedReviews);
                return true;
            })
            .catch(error => {
                throw error;
            });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700">
                    <p className="font-bold">오류 발생</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CompanyHeader company={company} />
            <CompanyTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'info' && <CompanyInfoTab company={company} />}
            {activeTab === 'jobs' && <JobListTab jobPosts={jobPosts} />}
            {activeTab === 'reviews' && (
                <ReviewListTab
                    reviews={reviews}
                    companyId={companyId}
                    onReviewAdded={handleReviewAdded}
                />
            )}
        </div>
    );
};

export default CompanyDetail;