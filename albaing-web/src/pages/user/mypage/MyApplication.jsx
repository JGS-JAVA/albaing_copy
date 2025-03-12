import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiMyApplicationService from "../../../service/apiMyApplicationService";

const MyApplications = () => {
    const { resumeId } = useParams();
    const [applications, setApplications] = useState([]);
    const [applicationStats, setApplicationStats] = useState(null); // 상태 개수 저장

    useEffect(() => {
        apiMyApplicationService.getJobApplicationsByResume(resumeId, setApplications);
        apiMyApplicationService.getApplicationStatsByResume(resumeId, setApplicationStats);
    }, [resumeId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">지원한 공고 내역</h2>

            {/* 지원 상태 개수 (통계) 출력 */}
            {applicationStats && (
                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                    <p className="text-lg font-medium">📊 지원 현황</p>
                    <ul className="flex space-x-4 mt-2">
                        <li className="text-blue-600">총 지원: {applicationStats.totalApplications}</li>
                        <li className="text-yellow-500">승인 대기: {applicationStats.approving}</li>
                        <li className="text-green-500">합격: {applicationStats.approved}</li>
                        <li className="text-red-500">불합격: {applicationStats.denied}</li>
                    </ul>
                </div>
            )}

            {/* 지원한 공고 목록 */}
            {applications.length === 0 ? (
                <p>지원한 공고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {applications.map((application) => (
                        <li key={application.resumeId} className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">{application.jobPostTitle}</h3>
                            <p className="text-gray-700">{application.companyName}</p>
                            <p className={`mt-1 font-medium ${getStatusColor(application.approveStatus)}`}>
                                {convertStatus(application.approveStatus)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// 지원 상태별 색상 지정 함수
const getStatusColor = (status) => {
    switch (status) {
        case "approving": return "text-yellow-500";
        case "approved": return "text-green-500";
        case "denied": return "text-red-500";
        default: return "text-gray-700";
    }
};

// 지원 상태 변환 함수
const convertStatus = (status) => {
    switch (status) {
        case "approving": return "승인대기중";
        case "approved": return "합격";
        case "denied": return "불합격";
        default: return "미정";
    }
};

export default MyApplications;
