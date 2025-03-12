import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiScrapService from '../../../service/apiScrapService';

const ScrapPage = () => {
    const { userId } = useParams();
    const [scrapedPosts, setScrapedPosts] = useState([]); // 스크랩한 공고 목록 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 오류 상태

    // 사용자 스크랩 목록 가져오기
    useEffect(() => {
        if (userId) {
            setLoading(true);
            apiScrapService.getScrapsByUser(userId)
                .then((data) => {
                    setScrapedPosts(data || []); // 데이터를 받아서 상태 업데이트
                    setLoading(false); // 로딩 완료
                })
                .catch((err) => {
                    setError('스크랩 목록을 불러오는 데 실패했습니다.');
                    setLoading(false);
                });
        }
    }, [userId]); // userId가 변경될 때마다 API 호출

    // 스크랩 추가
    const handleAddScrap = (jobPostId) => {
        apiScrapService.addScrap(userId, jobPostId)
            .then(() => {
                setScrapedPosts((prevScraps) => [...prevScraps, jobPostId]); // 공고 ID 추가
            })
            .catch((err) => {
                setError('스크랩 추가에 실패했습니다.');
            });
    };

    // 스크랩 삭제
    const handleRemoveScrap = (jobPostId) => {
        apiScrapService.removeScrap(userId, jobPostId)
            .then(() => {
                setScrapedPosts((prevScraps) => prevScraps.filter((id) => id !== jobPostId)); // 공고 ID 삭제
            })
            .catch((err) => {
                setError('스크랩 삭제에 실패했습니다.');
            });
    };

    return (
        <div className="scrap-page">
            <h1>내 스크랩 목록</h1>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {scrapedPosts.length === 0 && !loading && (
                    <li>스크랩한 공고가 없습니다.</li>
                )}
                {scrapedPosts.map((jobPostId) => (
                    <li key={jobPostId}>
                        <div className="job-post">
                            <span>공고 제목: {jobPostId}</span> {/* jobPostId 대신 실제 공고 제목이 오도록 수정 필요 */}
                            <button onClick={() => handleRemoveScrap(jobPostId)}>스크랩 취소</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 예시 공고 추가 */}
            <button onClick={() => handleAddScrap(123)}>스크랩 추가 예시</button>
        </div>
    );
};

export default ScrapPage;
