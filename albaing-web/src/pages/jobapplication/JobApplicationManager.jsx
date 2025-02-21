// JobApplicationManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API 기본 설정
const api = axios.create({
    baseURL: 'http://localhost:8080/api',  // 스프링 부트 서버 주소
    headers: {
        'Content-Type': 'application/json',
    }
});

const JobApplicationManager = ({ jobPostId }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/applications/${jobPostId}`);
            setApplications(response.data);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        try {
            await api.put(`/applications/${applicationId}/status`, null, {
                params: { status }
            });
            fetchApplications();  // 목록 새로고침
        } catch (err) {
            console.log(err);  // 실제 환경에서는 에러 처리 추가 필요
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [jobPostId]);

    if (loading) return <div>로딩중...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>지원자 관리</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>지원자 ID</th>
                    <th>이력서 ID</th>
                    <th>지원일시</th>
                    <th>상태</th>
                    <th>관리</th>
                </tr>
                </thead>
                <tbody>
                {applications.map((app) => (
                    <tr key={app.jobApplicationId}>
                        <td>{app.jobApplicationId}</td>
                        <td>{app.resumeId}</td>
                        <td>{new Date(app.applicationAt).toLocaleString()}</td>
                        <td>{app.approveStatus}</td>
                        <td>
                            <button
                                onClick={() => updateStatus(app.jobApplicationId, 'approved')}
                                disabled={app.approveStatus === 'approved'}
                            >
                                승인
                            </button>
                            <button
                                onClick={() => updateStatus(app.jobApplicationId, 'denied')}
                                disabled={app.approveStatus === 'denied'}
                                style={{ marginLeft: '8px' }}
                            >
                                거절
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobApplicationManager;