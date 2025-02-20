import React, { useState, useEffect } from 'react';


const JobPostList = () => {
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        jobCategory: '',
        jobType: '',
        keyword: '',
        page: 1,
        size: 10
    });

    // 채용공고 목록 조회
    const fetchJobPosts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                onlyActive: true
            }).toString();

            const response = await fetch(`/api/jobs?${queryParams}`);
            const data = await response.json();

            console.log("Fetched data:", data); // 응답 데이터 확인

            if (data && Array.isArray(data.content)) {
                setJobPosts(data.content);
            } else {
                setJobPosts([]); // 오류 방지: 빈 배열 할당
            }
        } catch (error) {
            console.error('Failed to fetch job posts:', error);
            setJobPosts([]); // 오류 발생 시 빈 배열로 설정
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobPosts();
    }, [filters]);



    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">채용공고 관리</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    새 공고 등록
                </button>
            </div>

            {/* 필터 섹션 */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select
                        value={filters.jobCategory}
                        onChange={(e) => setFilters({...filters, jobCategory: e.target.value})}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">직군 선택</option>
                        <option value="외식/음료">외식/음료</option>
                        <option value="유통/판매">유통/판매</option>
                        <option value=" IT/기술">IT/기술</option>
                        <option value="서비스">서비스</option>
                    </select>

                    <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">고용형태 선택</option>
                        <option value="알바">알바</option>
                        <option value="정규직">정규직</option>
                        <option value="계약직">계약직</option>
                        <option value="파견직">파견직</option>
                    </select>

                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={filters.keyword}
                            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
            </div>

            {/* 채용공고 목록 */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">로딩중...</div>
                ) : (
                    jobPosts.map((post) => (
                        <div key={post.jobPostId} className="bg-white p-6 rounded shadow hover:shadow-lg transition-shadow">
                            <div className="flex justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{post.jobPostTitle}</h2>
                                    <div className="space-y-2 text-gray-600">
                                        <p>근무지: {post.jobPostWorkPlace}</p>
                                        <p>급여: {post.jobPostSalary}</p>
                                        <p>근무시간: {post.jobPostShiftHours}</p>
                                        <div className="flex gap-2 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {post.jobPostJobCategory}
                      </span>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {post.jobPostJobType}
                      </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {/* 수정 로직 */}}
                                        className="px-3 py-1 border rounded hover:bg-gray-100"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => {/* 삭제 로직 */}}
                                        className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobPostList;