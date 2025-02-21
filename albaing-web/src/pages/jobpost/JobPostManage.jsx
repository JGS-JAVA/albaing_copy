import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobPostManage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobPost, setJobPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/jobs/${id}`)
            .then(response => setJobPost(response.data))
            .catch(error => console.error('Error:', error))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleDelete = () => {
        if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) return;

        axios.delete(`http://localhost:8080/api/jobs/${id}`)
            .then(() => navigate('/job-posts'))
            .catch(error => {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다');
            });
    };

    const handleStatusChange = () => {
        axios.patch(`http://localhost:8080/api/jobs/${id}/status`, { status: !jobPost.jobPostStatus })
            .then(() => {
                setJobPost(prev => ({
                    ...prev,
                    jobPostStatus: !prev.jobPostStatus
                }));
            })
            .catch(error => {
                console.error('Error:', error);
                alert('상태 변경 중 오류가 발생했습니다');
            });
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (!jobPost) return <div>채용공고를 찾을 수 없습니다</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{jobPost.jobPostTitle}</h1>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate(`/job-posts/${id}/edit`)} style={{ marginRight: '10px' }}>수정</button>
                <button onClick={handleDelete} style={{ marginRight: '10px' }}>삭제</button>
                <button onClick={handleStatusChange} style={{ marginRight: '10px' }}>
                    {jobPost.jobPostStatus ? '공고 마감하기' : '공고 재개하기'}
                </button>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>작성일: {new Date(jobPost.jobPostCreatedAt).toLocaleDateString()}</p>
                <p>수정일: {new Date(jobPost.jobPostUpdatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default JobPostManage;
