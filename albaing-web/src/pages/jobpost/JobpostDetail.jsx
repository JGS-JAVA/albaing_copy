import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobPostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobPost, setJobPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobPost = async () => {
            try {
                const response = await fetch(`/api/job-posts/${id}`);
                if (!response.ok) throw new Error('공고를 불러오는데 실패했습니다');
                const data = await response.json();
                setJobPost(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/job-posts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('삭제에 실패했습니다');
            navigate('/job-posts');
        } catch (error) {
            console.error('Error:', error);
            alert('삭제 중 오류가 발생했습니다');
        }
    };

    const handleStatusChange = async (status) => {
        try {
            const response = await fetch(`/api/job-posts/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error('상태 변경에 실패했습니다');

            setJobPost(prev => ({
                ...prev,
                jobPostStatus: status
            }));
        } catch (error) {
            console.error('Error:', error);
            alert('상태 변경 중 오류가 발생했습니다');
        }
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (!jobPost) return <div>채용공고를 찾을 수 없습니다</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                {jobPost.jobPostTitle}
            </h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate(`/job-posts/${id}/edit`)}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                    style={{ marginRight: '10px', padding: '5px 10px' }}
                >
                    삭제
                </button>
                <button
                    onClick={() => handleStatusChange(!jobPost.jobPostStatus)}
                    style={{ padding: '5px 10px' }}
                >
                    {jobPost.jobPostStatus ? '공고 마감하기' : '공고 재개하기'}
                </button>
            </div>

            {jobPost.jobPostOptionalImage && (
                <img
                    src={jobPost.jobPostOptionalImage}
                    alt="채용공고 이미지"
                    style={{ maxWidth: '100%', marginBottom: '20px' }}
                />
            )}

            <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                    <h3 style={{ fontWeight: 'bold' }}>연락처</h3>
                    <p>{jobPost.jobPostContactNumber}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>필요 학력</h3>
                    <p>{jobPost.jobPostRequiredEducations}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>직종</h3>
                    <p>{jobPost.jobPostJobCategory}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>고용 형태</h3>
                    <p>{jobPost.jobPostJobType}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>근무 기간</h3>
                    <p>{jobPost.jobPostWorkingPeriod}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>근무 일정</h3>
                    <p>{jobPost.jobWorkSchedule}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>근무 시간</h3>
                    <p>{jobPost.jobPostShiftHours}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>급여</h3>
                    <p>{jobPost.jobPostSalary}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>근무지</h3>
                    <p>{jobPost.jobPostWorkPlace}</p>
                </div>

                <div>
                    <h3 style={{ fontWeight: 'bold' }}>마감일</h3>
                    <p>{new Date(jobPost.jobPostDueDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>작성일: {new Date(jobPost.jobPostCreatedAt).toLocaleDateString()}</p>
                <p>수정일: {new Date(jobPost.jobPostUpdatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default JobPostDetail;