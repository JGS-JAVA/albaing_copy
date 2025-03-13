import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useErrorHandler } from '../../../utils/ErrorHandler';
import { LoadingSpinner, ErrorMessage } from "../../../components";

const ScrapPage = () => {
    const [scrapItems, setScrapItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData } = useAuth();
    const { handleError } = useErrorHandler();

    useEffect(() => {
        if (!userData || !userData.userId) {
            setLoading(false);
            setError('사용자 정보를 찾을 수 없습니다.');
            return;
        }

        setLoading(true);

        axios.get(`/api/scrap/user/${userData.userId}`, { withCredentials: true })
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    // 스크랩 목록이 있는 경우
                    const scrapIds = response.data.map(scrap => scrap.jobPostId);

                    // 공고 상세 정보 조회
                    return axios.get('/api/jobs/byIds', {
                        params: { ids: scrapIds.join(',') },
                        withCredentials: true
                    });
                } else {
                    // 스크랩 목록이 없는 경우
                    return Promise.resolve({ data: [] });
                }
            })
            .then(response => {
                setScrapItems(response.data || []);
                setLoading(false);
            })
            .catch(error => {
                handleError(error, '스크랩 목록을 불러오는 데 실패했습니다.');
                setError('스크랩 목록을 불러오는 데 실패했습니다.');
                setLoading(false);
            });
    }, [userData]);

    // 스크랩 삭제 처리
    const handleRemoveScrap = (jobPostId, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!userData || !userData.userId) return;

        setLoading(true);

        axios.delete(`/api/scrap/remove/${userData.userId}/${jobPostId}`, { withCredentials: true })
            .then(() => {
                // 삭제 성공 시 목록에서 해당 항목 제거
                setScrapItems(prevItems => prevItems.filter(item => item.jobPostId !== jobPostId));

                // localStorage에서도 제거
                const scrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
                const updatedScraps = scrapedPosts.filter(id => id !== jobPostId);
                localStorage.setItem("scrapedPosts", JSON.stringify(updatedScraps));
            })
            .catch(error => {
                handleError(error, '스크랩 삭제 중 오류가 발생했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <LoadingSpinner message="스크랩 목록을 불러오는 중..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (scrapItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">내 스크랩 목록</h2>
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <p className="text-lg text-gray-600 mb-4">스크랩한 항목이 없습니다.</p>
                    <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        채용 공고 보러가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">내 스크랩 목록</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scrapItems.map((item) => (
                    <div key={item.jobPostId} className="bg-white rounded-lg shadow-md p-6 relative hover:shadow-lg transition-shadow">
                        <button
                            onClick={(e) => handleRemoveScrap(item.jobPostId, e)}
                            className="absolute top-3 right-3 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                            title="스크랩 삭제"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <Link to={`/jobs/${item.jobPostId}`} className="block">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-8">{item.jobPostTitle}</h3>
                            <p className="text-gray-600 mb-4">{item.companyName || '회사명 미지정'}</p>

                            <div className="mb-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    item.jobPostStatus && new Date(item.jobPostDueDate) > new Date()
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {item.jobPostStatus && new Date(item.jobPostDueDate) > new Date() ? '채용중' : '마감됨'}
                                </span>
                            </div>

                            <div className="text-sm text-gray-500">
                                <p><span className="font-medium">급여:</span> {item.jobPostSalary || '-'}</p>
                                <p><span className="font-medium">지역:</span> {item.jobPostWorkPlace ? item.jobPostWorkPlace.split(' ')[0] : '-'}</p>
                                <p><span className="font-medium">마감일:</span> {new Date(item.jobPostDueDate).toLocaleDateString()}</p>
                            </div>

                            <div className="mt-4 text-right">
                                <span className="text-blue-600 hover:text-blue-800">상세보기 →</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrapPage;