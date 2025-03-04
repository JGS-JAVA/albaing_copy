import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JobPostDetail() {
    const { jobPostId } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/jobs/${jobPostId}`)
            .then((response) => {
                setJobPost(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("채용 공고 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    }, [jobPostId]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;
    if (!jobPost) return <p>해당 공고를 찾을 수 없습니다.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{jobPost.jobPostTitle}</h1>
            <p><strong>기업 ID:</strong> {jobPost.companyId}</p>
            <p><strong>카테고리:</strong> {jobPost.jobPostJobCategory}</p>
            <p><strong>근무 유형:</strong> {jobPost.jobPostJobType}</p>
            <p><strong>근무지:</strong> {jobPost.jobPostWorkPlace}</p>
            <p><strong>급여:</strong> {jobPost.jobPostSalary} 원</p>
            <p><strong>마감일:</strong> {jobPost.jobPostDueDate}</p>
            <p><strong>연락처:</strong> {jobPost.jobPostContactNumber}</p>
        </div>
    );
}
