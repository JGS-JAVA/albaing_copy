import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../components/common';
import Pagination from '../../components/common/Pagination';

// 카테고리 분류 데이터
const categories = [
    { name: '전체', value: 'all' },
    { name: '사무직', value: 'office' },
    { name: '서비스업', value: 'service' },
    { name: 'IT/개발', value: 'it' },
    { name: '판매/영업', value: 'sales' },
    { name: '교육', value: 'education' },
    { name: '생산/건설', value: 'production' },
    { name: '운전/배달', value: 'delivery' },
];

// 지역 분류 데이터
const locations = [
    { name: '전체', value: 'all' },
    { name: '서울', value: 'seoul' },
    { name: '경기', value: 'gyeonggi' },
    { name: '인천', value: 'incheon' },
    { name: '부산', value: 'busan' },
    { name: '대구', value: 'daegu' },
    { name: '대전', value: 'daejeon' },
    { name: '광주', value: 'gwangju' },
];

export default function JobpostList() {
    // 상태 관리
    const [jobListings, setJobListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    // 초기 데이터 로드 및 필터링 조건 변경 시 데이터 새로 로드
    useEffect(() => {
        const fetchJobListings = async () => {
            setLoading(true);
            setError(null);

            try {
                // API 요청 준비
                let endpoint = '/api/jobs';

                // API 요청 파라미터 구성
                const params = {
                    page: currentPage,
                    size: itemsPerPage
                };

                if (selectedCategory && selectedCategory !== 'all') {
                    params.jobCategory = selectedCategory;
                }

                if (selectedLocation && selectedLocation !== 'all') {
                    params.location = selectedLocation;
                }

                if (searchQuery.trim()) {
                    params.keyword = searchQuery.trim();
                }

                // API 요청 실행
                const response = await axios.get(endpoint, {
                    params,
                    withCredentials: true
                });

                // 응답 데이터 처리
                if (response.data) {
                    const jobPosts = Array.isArray(response.data) ? response.data :
                        (response.data.content ? response.data.content : []);

                    setJobListings(jobPosts);

                    // 총 아이템 수 설정 (페이지네이션용)
                    const total = response.data.totalElements ||
                        response.data.totalItems ||
                        response.headers['x-total-count'] ||
                        jobPosts.length;

                    setTotalItems(Number(total));
                } else {
                    setJobListings([]);
                    setTotalItems(0);
                }
            } catch (err) {
                console.error('채용 공고 목록을 불러오는 중 오류가 발생했습니다:', err);

                if (err.response) {
                    if (err.response.status === 401) {
                        setError('인증이 필요합니다. 로그인 후 이용해주세요.');
                    } else if (err.response.status === 403) {
                        setError('접근 권한이 없습니다.');
                    } else if (err.response.status === 404) {
                        setError('요청한 정보를 찾을 수 없습니다.');
                    } else if (err.response.status === 405) {
                        setError('서버에서 해당 요청 메서드를 지원하지 않습니다.');
                    } else {
                        setError(`서버 오류가 발생했습니다. (${err.response.status})`);
                    }
                } else if (err.request) {
                    setError('서버 연결에 실패했습니다. 네트워크 연결을 확인해주세요.');
                } else {
                    setError('요청 중 오류가 발생했습니다: ' + err.message);
                }
                setJobListings([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        };

        fetchJobListings();
    }, [currentPage, selectedCategory, selectedLocation, searchQuery]);

    // 검색하기 버튼 클릭 시
    const handleSearch = () => {
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    // 엔터 키 입력 시 검색 실행
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            console.error('날짜 변환 오류:', e);
            return dateString;
        }
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">채용 정보</h2>
                    <p className="mt-4 text-lg text-gray-600">
                        다양한 채용공고를 확인하고 지금 바로 지원해보세요!
                    </p>
                </div>

                {/* 검색 필터 */}
                <div className="bg-white shadow rounded-lg mb-8 p-6 transition transform hover:shadow-lg">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">검색어</label>
                            <input
                                type="text"
                                id="search"
                                placeholder="직무, 회사명, 지역명 등"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">직종</label>
                            <select
                                id="category"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                            <select
                                id="location"
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 transition-all"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map((location) => (
                                    <option key={location.value} value={location.value}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                        >
                            검색하기
                        </button>
                    </div>
                </div>

                {/* 로딩 및 에러 상태 */}
                {loading && <LoadingSpinner message="채용 공고를 불러오는 중..." fullScreen={false} className="py-10" />}
                {error && <ErrorMessage message={error} />}

                {/* 채용 공고 목록 */}
                {!loading && !error && (
                    <div>
                        {jobListings.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <p className="text-gray-500">검색 결과가 없습니다.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {jobListings.map((job) => (
                                    <li key={job.jobPostId} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                        <Link to={`/jobs/${job.jobPostId}`} className="block">
                                            <div className="p-6">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {job.companyName ? job.companyName.charAt(0) : 'C'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-lg font-medium text-gray-900">{job.jobPostTitle || '제목 없음'}</h3>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {job.jobPostJobType || '미지정'}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">{job.companyName || '회사명 미지정'}</p>
                                                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                                </svg>
                                                                {job.jobPostWorkPlace || '위치 미정'}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                </svg>
                                                                {job.jobWorkSchedule || '근무일'}, {job.jobPostShiftHours || '근무시간'}
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                                </svg>
                                                                {job.jobPostSalary || '급여 미정'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="text-sm text-gray-500">
                                                        등록일: {formatDate(job.jobPostCreatedAt)}
                                                    </div>
                                                    <div className="text-sm font-medium text-red-600">
                                                        마감일: {formatDate(job.jobPostDueDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* 페이지네이션 */}
                        {totalItems > 0 && (
                            <Pagination
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}