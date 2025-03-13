import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiScrapService from "../../../service/apiScrapService";

const ScrapPage = () => {
    const { userId } = useParams();
    const [scrapedPosts, setScrapedPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
            apiScrapService.getScrapsByUser(userId,setScrapedPosts)
    }, [userId]);

    const handleRemoveScrap = (jobPostId) => {
        apiScrapService.removeScrap(userId, jobPostId);
        alert("스크랩한 공고에서 제거했습니다.");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">내 스크랩 목록</h3>

            {error && <p className="text-red-500 text-center">{error}</p>}

            {scrapedPosts.length === 0 ? (
                <p className="text-center text-gray-600">스크랩한 공고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {scrapedPosts.map((job) => (
                        <li
                            key={job.jobPostId}
                            className="p-4 border rounded-lg shadow-sm bg-[#F2F8FF] hover:bg-gray-50 transition"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-700">스크랩한 날짜: {new Date(job.scrapCreatedAt).toLocaleDateString()}</p>
                                    <h3 className="text-xl font-semibold">공고명: {job.jobPostTitle}</h3>
                                    <p className="text-gray-700">회사명 :{job.companyName}</p>
                                </div>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    onClick={() => handleRemoveScrap(job.jobPostId)}
                                >
                                    스크랩 취소
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ScrapPage;
