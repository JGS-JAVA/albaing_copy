import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiJobApplicationService from "../../../service/apiJobApplicationService";

const MyApplications = () => {
    const { resumeId } = useParams(); // 올바르게 resumeId 가져오기
    const [applications, setApplications] = useState([]); // 초기 상태를 빈 배열로 설정

    useEffect(() => {
        if (resumeId) {
            apiJobApplicationService.getJobApplicationsByResume(resumeId, setApplications);
        }
    }, [resumeId]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">지원한 공고 내역</h2>

            {applications.length === 0 ? (
                <p>지원한 공고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {applications.map((application) => (
                        <li key={application.resumeId} className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">{application.jobPostTitle}</h3>
                            <p className="text-gray-700">{application.companyName}</p>
                            <p className={`mt-1 font-medium ${getStatusColor(application.approveStatus)}`}>
                                {application.approveStatus}
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
        case "승인대기중":
            return "text-yellow-500";
        case "합격":
            return "text-green-500";
        case "불합격":
            return "text-red-500";
        default:
            return "text-gray-700";
    }
};

export default MyApplications;
