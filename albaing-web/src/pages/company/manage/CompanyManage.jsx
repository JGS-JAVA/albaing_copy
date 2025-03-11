import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { ErrorMessage, LoadingSpinner } from "../../../components";
import axios from 'axios';
import DashboardLayout from "./components/DashboardLayout";
import DashboardOverview from "./components/DashboardOverview";
import JobPostsManage from "./jobposts/JobPostsManage";
import ApplicationsManage from "./applications/ApplicationsManage";
import ReviewManage from "./reviews/ReviewManage";
import CompanyProfile from "./profile/CompanyProfile";

const CompanyManage = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, userType, userData } = useAuth();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [companyData, setCompanyData] = useState(null);
    const [jobPosts, setJobPosts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 로그인 및 기업 사용자 여부 체크
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

        setLoading(true);

        // 회사 정보 가져오기
        axios.get(`/api/companies/${companyId}`, { withCredentials: true })
            .then(companyRes => {
                setCompanyData(companyRes.data);
                return axios.get(`/api/jobs/company/${companyId}`, { withCredentials: true });
            })
            .then(jobRes => {
                setJobPosts(jobRes.data);
                // 회사 기준 지원자 목록 조회
                return axios.get(`/api/applications/company/${companyId}`, { withCredentials: true });
            })
            .then(appRes => {
                setApplications(appRes.data);
                // 회사 리뷰 조회
                return axios.get(`/api/companies/${companyId}/reviews`, { withCredentials: true });
            })
            .then(reviewRes => {
                setReviews(reviewRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("데이터 로딩 오류:", err);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [companyId, isLoggedIn, navigate, userData, userType]);

    const updateApplicantStatus = (applicationId, newStatus) => {
        axios.put(`/api/applications/${applicationId}`, { approveStatus: newStatus }, { withCredentials: true })
            .then(() => {
                setApplications(prev =>
                    prev.map(app =>
                        app.jobApplicationId === applicationId
                            ? { ...app, approveStatus: newStatus }
                            : app
                    )
                );
            })
            .catch(err => {
                console.error("지원자 상태 업데이트 오류:", err);
            });
    };

    // 데이터 새로고침 함수들
    const refreshJobPosts = () => {
        axios.get(`/api/jobs/company/${companyId}`, { withCredentials: true })
            .then(res => setJobPosts(res.data))
            .catch(err => console.error("채용공고 새로고침 오류:", err));
    };

    const refreshReviews = () => {
        axios.get(`/api/companies/${companyId}/reviews`, { withCredentials: true })
            .then(res => setReviews(res.data))
            .catch(err => console.error("리뷰 새로고침 오류:", err));
    };

    if (loading) return <LoadingSpinner message="로딩 중..." fullScreen={true} />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <DashboardLayout
            companyData={companyData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {activeTab === 'dashboard' && (
                <DashboardOverview
                    companyData={companyData}
                    jobPosts={jobPosts}
                    applications={applications}
                    reviews={reviews}
                />
            )}

            {activeTab === 'jobPosts' && (
                <JobPostsManage
                    jobPosts={jobPosts}
                    refreshJobPosts={refreshJobPosts}
                />
            )}

            {activeTab === 'applications' && (
                <ApplicationsManage
                    applications={applications}
                    updateApplicantStatus={updateApplicantStatus}
                />
            )}

            {activeTab === 'reviews' && (
                <ReviewManage
                    companyId={companyId}
                    reviews={reviews}
                    refreshReviews={refreshReviews}
                />
            )}

            {activeTab === 'profile' && (
                <CompanyProfile companyData={companyData} />
            )}
        </DashboardLayout>
    );
};

export default CompanyManage;