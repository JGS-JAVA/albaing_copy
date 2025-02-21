import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobPostDetail = () => {
    const { id } = useParams();
    const [jobPost, setJobPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [resumeId, setResumeId] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/jobs/${id}`)
            .then(response => setJobPost(response.data))
            .catch(error => console.error('Error:', error))
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleApply = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/applications', {
            jobPostId: id,
            resumeId: resumeId
        })
            .then(() => {
                alert('지원이 완료되었습니다!');
                setShowApplyForm(false);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('지원 중 오류가 발생했습니다');
            });
    };

    if (isLoading) return <div>로딩 중...</div>;
    if (!jobPost) return <div>채용공고를 찾을 수 없습니다</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>{jobPost.jobPostTitle}</h1>

            {jobPost.jobPostOptionalImage && (
                <img src={jobPost.jobPostOptionalImage} alt="채용공고 이미지" style={{ maxWidth: '100%', marginBottom: '20px' }} />
            )}

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setShowApplyForm(true)}
                    style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white' }}
                    disabled={!jobPost.jobPostStatus}
                >
                    입사지원
                </button>
            </div>

            {showApplyForm && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    <h2>입사지원</h2>
                    <form onSubmit={handleApply}>
                        <div>
                            <label>이력서 ID:</label>
                            <input
                                type="number"
                                value={resumeId}
                                onChange={(e) => setResumeId(e.target.value)}
                                required
                                style={{ margin: '10px 0', padding: '5px' }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button type="submit" style={{ marginRight: '10px' }}>지원하기</button>
                            <button type="button" onClick={() => setShowApplyForm(false)}>취소</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                <p>작성일: {new Date(jobPost.jobPostCreatedAt).toLocaleDateString()}</p>
                <p>수정일: {new Date(jobPost.jobPostUpdatedAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default JobPostDetail;
