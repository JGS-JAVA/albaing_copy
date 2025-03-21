import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../components';
import AdminLayout from './AdminLayout';

const StatCard = ({ title, value, icon, color, link }) => {
    return (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h2 className="text-3xl font-bold mt-2">{value}</h2>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} text-${color.replace('border-', '')}`}>
                    {icon}
                </div>
            </div>
            {link && (
                <div className="mt-4">
                    <Link to={link} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                        자세히 보기
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

const AdminMain = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        pendingCompanies: 0,
        activeJobPosts: 0,
        totalReviews: 0
    });

    useEffect(() => {
        // 대시보드 통계를 불러오는 API
        // 실제 구현 시에는 실제 API 호출로 변경해야 함
        const fetchStats = () => {
            setLoading(true);

            // 실제 API 대신 더미 데이터로 대체
            setTimeout(() => {
                setStats({
                    totalUsers: 450,
                    totalCompanies: 120,
                    pendingCompanies: 15,
                    activeJobPosts: 385,
                    totalReviews: 240
                });
                setLoading(false);
            }, 1000);

            /* 실제 API 호출 코드 (구현 시 활성화)
            axios.get('/api/admin/dashboard/stats')
                .then(response => {
                    setStats(response.data);
                })
                .catch(error => {
                    console.error('대시보드 통계 로딩 실패:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
            */
        };

        fetchStats();
    }, []);

    if (loading) {
        return <LoadingSpinner message="관리자 정보를 불러오는 중..." />;
    }

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
                <p className="text-gray-600 mt-1">알바잉 서비스 현황을 확인하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="총 회원 수"
                    value={stats.totalUsers}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>}
                    color="border-blue-500"
                    link="/admin/users"
                />
                <StatCard
                    title="등록 기업 수"
                    value={stats.totalCompanies}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                    color="border-purple-500"
                    link="/admin/companies"
                />
                <StatCard
                    title="승인 대기 기업"
                    value={stats.pendingCompanies}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                    color="border-yellow-500"
                    link="/admin/companies?filter=pending"
                />
                <StatCard
                    title="진행 중인 채용공고"
                    value={stats.activeJobPosts}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>}
                    color="border-green-500"
                    link="/admin/jobposts"
                />
                <StatCard
                    title="작성된 리뷰"
                    value={stats.totalReviews}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
                    color="border-orange-500"
                    link="/admin/reviews"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">최근 가입한 회원</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {/* 더미 데이터 */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">홍길동</td>
                                <td className="px-6 py-4 whitespace-nowrap">hong@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-03-19</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">김철수</td>
                                <td className="px-6 py-4 whitespace-nowrap">kim@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-03-18</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">이영희</td>
                                <td className="px-6 py-4 whitespace-nowrap">lee@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-03-17</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-right">
                        <Link to="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            모든 회원 보기
                        </Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">최근 등록된 공고</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">공고명</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기업</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마감일</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {/* 더미 데이터 */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">주니어 개발자 모집</td>
                                <td className="px-6 py-4 whitespace-nowrap">ABC 테크</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-04-15</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">고객 서비스 담당자</td>
                                <td className="px-6 py-4 whitespace-nowrap">XYZ 기업</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-04-10</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">마케팅 인턴</td>
                                <td className="px-6 py-4 whitespace-nowrap">디지털 마케팅</td>
                                <td className="px-6 py-4 whitespace-nowrap">2025-04-05</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-right">
                        <Link to="/admin/jobposts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            모든 공고 보기
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMain;