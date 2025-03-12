import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../../../components';
import companyService from '../../../service/apiCompanyService';
import Pagination from '../../../components/common/Pagination';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        setLoading(true);
        setError(null);

        companyService.getAllCompanies()
            .then(data => {
                setCompanies(data);
                setFilteredCompanies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('회사 목록 로딩 오류:', err);
                setError('회사 정보를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if(e.target.value.trim() === '') {
            setFilteredCompanies(companies);
        } else {
            const filtered = companies.filter(company =>
                company.companyName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                (company.companyDescription && company.companyDescription.toLowerCase().includes(e.target.value.toLowerCase()))
            );
            setFilteredCompanies(filtered);
        }
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const handleSearch = () => {
        if(searchTerm.trim() === '') {
            setFilteredCompanies(companies);
            return;
        }

        setLoading(true);
        companyService.searchCompaniesByName(searchTerm)
            .then(data => {
                setFilteredCompanies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('회사 검색 오류:', err);
                setLoading(false);
                setError('검색 중 오류가 발생했습니다.');
            });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const currentCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">기업 목록</h1>

            {/* 검색창 */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        placeholder="기업명 검색..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                            onClick={handleSearch}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 로딩 */}
            {loading && <LoadingSpinner message="회사 정보를 불러오는 중..." fullScreen={false} className="py-10" />}

            {/* 에러 */}
            {error && <ErrorMessage message={error} />}

            {/* 회사 목록 */}
            {!loading && !error && (
                <>
                    {filteredCompanies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentCompanies.map(company => (
                                <CompanyCard key={company.companyId} company={company} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    {filteredCompanies.length > itemsPerPage && (
                        <div className="mt-8">
                            <Pagination
                                totalItems={filteredCompanies.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// 회사 카드 컴포넌트
const CompanyCard = ({ company }) => {
    return (
        <Link to={`/companies/${company.companyId}`} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="p-6">
                    <div className="flex items-center mb-4">
                        {company.companyLogo ? (
                            <img
                                src={company.companyLogo}
                                alt={`${company.companyName} 로고`}
                                className="h-12 w-12 object-contain mr-4"
                            />
                        ) : (
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <span className="text-blue-500 font-bold text-xl">{company.companyName?.substring(0, 1)}</span>
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-gray-900">{company.companyName}</h2>
                    </div>

                    {company.companyDescription && (
                        <p className="text-gray-600 line-clamp-2 mb-3">{company.companyDescription}</p>
                    )}

                    <div className="mt-4 text-sm text-gray-500">
                        <div><span className="font-medium">대표자:</span> {company.companyOwnerName}</div>
                        <div><span className="font-medium">주소:</span> {company.companyLocalAddress}</div>
                    </div>

                    <div className="mt-4 text-right">
                        <span className="text-blue-600 hover:text-blue-800">상세보기 →</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Companies;