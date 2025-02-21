import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobApplicationManager = () => {
    const { jobPostId } = useParams();  // URL에서 jobPostId 가져오기
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/applications/${jobPostId}`)
            .then(response => setApplications(response.data))
            .catch(error => console.error('Error fetching applications:', error));
    }, [jobPostId]);

    const updateStatus = (applicationId, status) => {
        axios.put(`http://localhost:8080/api/applications/${applicationId}/status`, null, { params: { status } })
            .then(() => {
                setApplications(applications.map(app =>
                    app.jobApplicationId === applicationId ? { ...app, approveStatus: status } : app
                ));
            })
            .catch(error => console.error('Error updating status:', error));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>지원자 관리 (공고 ID: {jobPostId})</h2>
            {applications.length === 0 ? (
                <p>지원자가 없습니다.</p>
            ) : (
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
                    {applications.map(app => (
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
            )}
        </div>
    );
};

export default JobApplicationManager;
