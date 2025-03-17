import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import apiScrapService from "../../../service/apiScrapService";

const ScrapPage = () => {
    const {userId} = useParams();
    const [scrapedPosts, setScrapedPosts] = useState([]);


    useEffect(() => {
        apiScrapService.getScrapsByUser(userId, setScrapedPosts)
    }, [userId]);

    const handleRemoveScrap = (jobPostId) => {
        apiScrapService.removeScrap(userId, jobPostId)
            .then(() => {
                // 성공 시 즉시 목록 업데이트
                const updatedScraps = scrapedPosts.filter(job => job.jobPostId !== jobPostId);
                setScrapedPosts(updatedScraps);

                // localStorage 업데이트
                const scrapIds = updatedScraps.map(job => job.jobPostId);
                localStorage.setItem("scrapedPosts", JSON.stringify(scrapIds));

                alert("스크랩한 공고에서 제거했습니다.");
            })
            .catch((err) => {
                console.error("스크랩 삭제 실패", err);
                alert("스크랩 삭제 중 오류가 발생했습니다.");
            });
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">내 스크랩 목록</h3>


            {scrapedPosts.length === 0 ? (
                <p className="text-center text-gray-600">스크랩한 공고가 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {scrapedPosts.map((job) => (
                        <li
                            key={job.jobPostId}
                            className="p-4 border rounded-lg shadow-sm bg-[#F2F8FF] hover:bg-gray-50 transition"
                        >
                            {/* 상단 텍스트 중앙정렬 및 볼드체 적용 */}
                            <div className="grid grid-cols-3 text-center text-[#0066FF]  font-bold mb-2">
                                <span>지원한 날짜</span>
                                <span>회사명</span>
                                <span>공고명</span>
                            </div>

                            {/* 구분선 */}
                            <hr className="border-gray-300 my-2"/>

                            <div className="grid grid-cols-3 text-center text-[#4887E4] font-bold gap-6">
                                <p>{new Date(job.scrapCreatedAt).toLocaleDateString()}</p>
                                <p><Link to={`/companies/${job.companyId}`}>{job.companyName}</Link></p>
                                <p><Link to={`/jobs/${job.jobPostId}`}>{job.jobPostTitle}</Link></p>
                            </div>

                            {/* 스크랩 취소 버튼 크기 줄이기 */}
                            <div className="flex justify-center mt-3">
                                <button
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-red-600 transition"
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

}

export default ScrapPage;

