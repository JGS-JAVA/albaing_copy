import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../components/common';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../contexts/AuthContext';
import JobCard from "./components/JobCard";

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
    // Auth 컨텍스트 사용
    const { isLoggedIn, userType, userData } = useAuth();

    // 상태 관리
    const [jobListings, setJobListings] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({});  // 회사 정보(이름, 이미지)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [scrapedPosts, setScrapedPosts] = useState([]);
    const [modal, setModal] = useState({ show: false, message: "", type: "" });

    // 초기 데이터 로드 및 필터링 조건 변경 시 데이터 새로 로드
    useEffect(() => {
        fetchJobListings();
    }, [currentPage, selectedCategory, selectedLocation, searchQuery]);

    // 회사 정보 데이터 불러오기
    useEffect(() => {
        if (jobListings.length > 0) {
            fetchCompanyInfo();
        }
    }, [jobListings]);

    // 스크랩된 공고 목록 로드
    useEffect(() => {
        if (isLoggedIn && userType === "personal") {
            // 로컬 스토리지에서 불러오기
            const localScrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
            setScrapedPosts(localScrapedPosts);

            // API에서 불러오기 (사용자 ID가 있는 경우)
            if (userData && userData.userId) {
                fetchUserScraps(userData.userId);
            }
        }
    }, [isLoggedIn, userType, userData]);

    // 사용자 스크랩 목록 가져오기 - Promise 방식
    const fetchUserScraps = (userId) => {
        axios.get(`/api/scrap/user/${userId}`, { withCredentials: true })
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const apiScrapedPosts = response.data.map(scrap => Number(scrap.jobPostId));

                    // 로컬 스토리지 스크랩과 API 스크랩 병합
                    const localScrapedPosts = JSON.parse(localStorage.getItem("scrapedPosts") || "[]");
                    const mergedScraps = [...new Set([...localScrapedPosts, ...apiScrapedPosts])];

                    setScrapedPosts(mergedScraps);
                    localStorage.setItem("scrapedPosts", JSON.stringify(mergedScraps));
                }
            })
            .catch(error => {
                console.error("스크랩 목록 조회 실패", error);
            });
    };

    // 회사 정보 데이터 조회 - Promise 방식
    const fetchCompanyInfo = () => {
        // 중복 제거를 위해 Set 사용
        const uniqueCompanyIds = [...new Set(
            jobListings
                .filter(job => job.companyId)
                .map(job => job.companyId)
        )];

        // 이미 가져온 회사 정보 제외
        const idsToFetch = uniqueCompanyIds.filter(id => !companyInfo[id]);

        if (idsToFetch.length === 0) return;

        // 회사 정보 조회
        const newCompanyInfo = { ...companyInfo };

        Promise.all(
            idsToFetch.map(companyId => {
                return axios.get(`/api/companies/${companyId}`, { withCredentials: true })
                    .then(response => {
                        if (response.data) {
                            newCompanyInfo[companyId] = {
                                companyName: response.data.companyName || "회사명 미지정",
                                companyImage: response.data.companyImage || null
                            };
                        }
                        return companyId;
                    })
                    .catch(() => {
                        // 회사 정보 조회 실패 시 처리하지 않음
                        newCompanyInfo[companyId] = {
                            companyName: "회사명 미지정",
                            companyImage: null
                        };
                        return companyId;
                    });
            })
        )
            .then(() => {
                setCompanyInfo(newCompanyInfo);
            });
    };

    // 회사 정보 가져오기
    const getCompanyInfo = (job) => {
        // 이미 공고에 회사명이 포함된 경우
        if (job.companyName) {
            return {
                companyName: job.companyName,
                companyImage: job.companyImage || null
            };
        }

        // 회사 ID로 정보 조회
        if (job.companyId && companyInfo[job.companyId]) {
            return companyInfo[job.companyId];
        }

        // 기본 정보
        return {
            companyName: "회사명 미지정",
            companyImage: null
        };
    };

    const fetchJobListings = () => {
        setLoading(true);
        setError(null);

        // API 요청 준비
        const endpoint = '/api/jobs';

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
        axios.get(endpoint, {
            params,
            withCredentials: true
        })
            .then(response => {
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
                setLoading(false);
            })
            .catch(() => {
                setError('채용 공고를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                setJobListings([]);
                setTotalItems(0);
                setLoading(false);
            });
    };

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
            return dateString;
        }
    };

    // 모달 관련 함수
    const showModal = (message, type) => {
        setModal({ show: true, message, type });
    };

    const closeModal = () => {
        setModal({ show: false, message: "", type: "" });
    };

    // 스크랩 토글 함수
    const toggleScrap = (jobPostId, event) => {
        // 이벤트 전파 방지 (Link 클릭 방지)
        event.preventDefault();
        event.stopPropagation();

        if (!isLoggedIn) {
            showModal("로그인 후 이용 가능합니다.", "alert");
            return;
        }

        if (userType !== "personal") {
            showModal("개인 회원만 스크랩할 수 있습니다.", "alert");
            return;
        }

        const jobId = Number(jobPostId);
        const isCurrentlyScraped = scrapedPosts.includes(jobId);
        let updatedScraps = [...scrapedPosts];

        if (isCurrentlyScraped) {
            // 스크랩 취소
            updatedScraps = updatedScraps.filter(id => id !== jobId);

            // API 호출 (사용자 ID가 있는 경우)
            if (userData && userData.userId) {
                axios.delete(`/api/scrap/remove/${userData.userId}/${jobId}`, { withCredentials: true })
                    .catch(() => {/* 실패 시 특별한 처리 없음 */});
            }
        } else {
            // 스크랩 추가
            updatedScraps.push(jobId);

            // API 호출 (사용자 ID가 있는 경우)
            if (userData && userData.userId) {
                axios.post(`/api/scrap/add/${userData.userId}/${jobId}`, {}, { withCredentials: true })
                    .catch(() => {/* 실패 시 특별한 처리 없음 */});
            }
        }

        // 상태 및 로컬 스토리지 업데이트
        setScrapedPosts(updatedScraps);
        localStorage.setItem("scrapedPosts", JSON.stringify(updatedScraps));
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

                {/* 채용 공고 목록 - 카드 형식 */}
                {!loading && !error && (
                    <div>
                        {jobListings.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-lg shadow">
                                <p className="text-gray-500">검색 결과가 없습니다.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {jobListings.map((job) => {
                                    const company = getCompanyInfo(job);
                                    const isScraped = scrapedPosts.includes(Number(job.jobPostId));

                                    return (
                                        <JobCard
                                            key={job.jobPostId}
                                            job={job}
                                            company={company}
                                            isScraped={isScraped}
                                            isLoggedIn={isLoggedIn}
                                            userType={userType}
                                            toggleScrap={toggleScrap}
                                            formatDate={formatDate}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* 페이지네이션 */}
                        {totalItems > 0 && (
                            <div className="mt-8">
                                <Pagination
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 모달 */}
            {modal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">알림</h3>
                        <p className="mb-6">{modal.message}</p>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={closeModal}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}