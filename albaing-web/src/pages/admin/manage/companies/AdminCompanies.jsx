import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { LoadingSpinner, ErrorMessage, ConfirmModal, useModal } from '../../../../components';
import AdminLayout from '../../AdminLayout';
import Pagination from '../../../../components/common/Pagination';

// 기업 상세 모달
const CompanyDetailModal = ({ isOpen, onClose, company }) => {
    if (!isOpen || !company) return null;

    // 날짜 포맷 변환
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'yyyy-MM-dd');
    };

    // 승인 상태 표시 (한글화)
    const getApprovalStatusText = (status) => {
        switch(status) {
            case 'approved': return '승인됨';
            case 'approving': return '대기중';
            case 'hidden': return '숨김';
            default: return status;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">기업 상세 정보</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start">
                        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
                            <div className="relative">
                                <img
                                    src={company.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=2563EB&color=fff&size=150`}
                                    alt={company.companyName}
                                    className="w-36 h-36 rounded object-contain border border-gray-200 shadow-md p-2"
                                />
                            </div>
                        </div>

                        <div className="md:w-2/3 md:pl-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">회사명</h4>
                                    <p className="text-lg font-medium">{company.companyName}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">사업자등록번호</h4>
                                    <p className="text-lg">{company.companyRegistrationNumber}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">대표자명</h4>
                                    <p className="text-lg">{company.companyOwnerName}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">개업일</h4>
                                    <p className="text-lg">{company.companyOpenDate ? formatDate(company.companyOpenDate) : '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">이메일</h4>
                                    <p className="text-lg">{company.companyEmail}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">전화번호</h4>
                                    <p className="text-lg">{company.companyPhone || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">지역</h4>
                                    <p className="text-lg">{company.companyLocalAddress || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">승인 상태</h4>
                                    <p className={`text-lg font-medium ${
                                        company.companyApprovalStatus === 'approved' ? 'text-green-600' :
                                            company.companyApprovalStatus === 'approving' ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                        {getApprovalStatusText(company.companyApprovalStatus)}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">가입일</h4>
                                    <p className="text-lg">{formatDate(company.companyCreatedAt)}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">최근 수정일</h4>
                                    <p className="text-lg">{formatDate(company.companyUpdatedAt)}</p>
                                </div>
                            </div>

                            {company.companyDescription && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-500">회사 소개</h4>
                                    <p className="text-sm mt-1 bg-gray-50 p-3 rounded whitespace-pre-line">{company.companyDescription}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 승인 상태 변경 모달
const ApprovalStatusModal = ({ isOpen, onClose, company, onUpdateStatus }) => {
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        if (company) {
            setSelectedStatus(company.companyApprovalStatus || 'approving');
        }
    }, [company]);

    if (!isOpen || !company) return null;

    const statusOptions = [
        { value: 'approved', label: '승인', description: '기업 계정을 승인합니다. 모든 기능을 사용할 수 있습니다.' },
        { value: 'approving', label: '대기', description: '승인 대기 상태로 유지합니다. 로그인이 제한됩니다.' },
        { value: 'hidden', label: '숨김', description: '기업 계정을 숨깁니다. 로그인 및 모든 기능이 제한됩니다.' }
    ];

    const handleSubmit = () => {
        onUpdateStatus(company.companyId, selectedStatus);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">기업 승인 상태 변경</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="font-medium text-gray-800">{company.companyName}</p>
                        <p className="text-sm text-gray-600">사업자등록번호: {company.companyRegistrationNumber}</p>
                    </div>

                    <div className="space-y-3">
                        {statusOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedStatus === option.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedStatus(option.value)}
                            >
                                <div className="flex items-center">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                            selectedStatus === option.value
                                                ? 'border-blue-500'
                                                : 'border-gray-400'
                                        }`}
                                    >
                                        {selectedStatus === option.value && (
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        )}
                                    </div>
                                    <span className="ml-2 font-medium">{option.label}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 ml-7">{option.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            변경
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filters, setFilters] = useState({
        companyName: '',
        companyOwnerName: '',
        companyPhone: '',
        companyRegistrationNumber: '',
        status: ''
    });
    const [sortField, setSortField] = useState('companyName');
    const [sortDirection, setSortDirection] = useState('asc');

    // 모달 상태 관리
    const detailModal = useModal();
    const approveModal = useModal();
    const deleteModal = useModal();

    // 기업 목록 가져오기
    const fetchCompanies = () => {
        setLoading(true);
        setError(null);

        axios.get('/api/admin/companies', {
            params: {
                companyName: filters.companyName,
                companyOwnerName: filters.companyOwnerName,
                companyPhone: filters.companyPhone,
                companyRegistrationNumber: filters.companyRegistrationNumber,
                sortOrderBy: sortField,
                isDESC: sortDirection === 'desc'
            }
        })
            .then(response => {
                setCompanies(response.data);
                setTotalItems(response.data.length);
                setLoading(false);
            })
            .catch(error => {
                console.error('기업 목록 로딩 실패:', error);
                setError('기업 목록을 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCompanies();
    }, [sortField, sortDirection]);

    // 기업 삭제
    const handleDeleteCompany = () => {
        if (!selectedCompany) return;

        setLoading(true);

        axios.delete(`/api/admin/companies/${selectedCompany.companyId}`)
            .then(() => {
                fetchCompanies();
                deleteModal.closeModal();
                setSelectedCompany(null);
            })
            .catch(error => {
                console.error('기업 삭제 실패:', error);
                setError('기업 삭제에 실패했습니다.');
                setLoading(false);
            });
    };

    // 승인 상태 업데이트
    const handleUpdateApprovalStatus = (companyId, status) => {
        setLoading(true);

        axios.patch(`/api/admin/companies/${companyId}/approval`, { status })
            .then(() => {
                fetchCompanies();
                approveModal.closeModal();
                setSelectedCompany(null);
            })
            .catch(error => {
                console.error('승인 상태 변경 실패:', error);
                setError('승인 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    // 기업 상세 보기
    const handleViewCompany = (company) => {
        setSelectedCompany(company);
        detailModal.openModal();
    };

    // 승인 상태 변경 모달 열기
    const handleOpenApprovalModal = (company) => {
        setSelectedCompany(company);
        approveModal.openModal();
    };

    // 삭제 확인 모달 열기
    const handleOpenDeleteModal = (company) => {
        setSelectedCompany(company);
        deleteModal.openModal();
    };

    // 검색 필터 적용
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCompanies();
    };

    // 필터 변경 핸들러
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 정렬 변경 핸들러
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 현재 페이지의 회원 목록
    const getCurrentCompanies = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return companies.slice(indexOfFirstItem, indexOfLastItem);
    };

    // 정렬 아이콘 표시
    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    // 승인 상태 뱃지 색상
    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'approving': return 'bg-yellow-100 text-yellow-800';
            case 'hidden': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // 승인 상태 한글 표시
    const getStatusText = (status) => {
        switch(status) {
            case 'approved': return '승인됨';
            case 'approving': return '대기중';
            case 'hidden': return '숨김';
            default: return status;
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">기업 관리</h1>
                    <p className="text-gray-600 mt-1">기업 회원 정보를 관리할 수 있습니다.</p>
                </div>
                <div className="mt-4 lg:mt-0">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                setFilters(prev => ({ ...prev, status: 'approving' }));
                                fetchCompanies();
                            }}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            승인 대기 기업 보기
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">회사명</label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={filters.companyName}
                            onChange={handleFilterChange}
                            placeholder="회사명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyOwnerName" className="block text-sm font-medium text-gray-700 mb-1">대표자명</label>
                        <input
                            type="text"
                            id="companyOwnerName"
                            name="companyOwnerName"
                            value={filters.companyOwnerName}
                            onChange={handleFilterChange}
                            placeholder="대표자명 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-1">사업자등록번호</label>
                        <input
                            type="text"
                            id="companyRegistrationNumber"
                            name="companyRegistrationNumber"
                            value={filters.companyRegistrationNumber}
                            onChange={handleFilterChange}
                            placeholder="사업자등록번호 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                        <input
                            type="text"
                            id="companyPhone"
                            name="companyPhone"
                            value={filters.companyPhone}
                            onChange={handleFilterChange}
                            placeholder="전화번호 검색"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">승인 상태</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="all">모든 상태</option>
                            <option value="approved">승인됨</option>
                            <option value="approving">승인 대기중</option>
                            <option value="hidden">숨김</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                        >
                            검색
                        </button>
                    </div>
                </form>
            </div>

            {error && <ErrorMessage message={error} className="mb-6" />}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <LoadingSpinner message="기업 정보를 불러오는 중..." fullScreen={false} className="py-12" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyId')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            번호 {sortField === 'companyId' && renderSortIcon('companyId')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            회사명 {renderSortIcon('companyName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyOwnerName')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            대표자명 {renderSortIcon('companyOwnerName')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('companyRegistrationNumber')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            사업자번호 {renderSortIcon('companyRegistrationNumber')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상태
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center hover:text-gray-700"
                                        >
                                            가입일 {renderSortIcon('createdAt')}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        관리
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {getCurrentCompanies().length > 0 ? (
                                    getCurrentCompanies().map((company) => (
                                        <tr key={company.companyId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                            src={company.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.companyName)}&background=2563EB&color=fff`}
                                                            alt={company.companyName}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {company.companyName}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyOwnerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {company.companyRegistrationNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(company.companyApprovalStatus)}`}>
                                                        {getStatusText(company.companyApprovalStatus)}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(company.companyCreatedAt), 'yyyy-MM-dd')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewCompany(company)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        상세
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenApprovalModal(company)}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        상태변경
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(company)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* 기업 상세 모달 */}
            <CompanyDetailModal
                isOpen={detailModal.isOpen}
                onClose={detailModal.closeModal}
                company={selectedCompany}
            />

            {/* 승인 상태 변경 모달 */}
            <ApprovalStatusModal
                isOpen={approveModal.isOpen}
                onClose={approveModal.closeModal}
                company={selectedCompany}
                onUpdateStatus={handleUpdateApprovalStatus}
            />

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
                onConfirm={handleDeleteCompany}
                title="기업 삭제"
                message={`'${selectedCompany?.companyName}' 기업을 삭제하시겠습니까? 삭제된 기업 정보와 관련 데이터는 복구할 수 없습니다.`}
                confirmText="삭제"
                cancelText="취소"
                type="danger"
            />
        </AdminLayout>
    );
};

export default AdminCompanies;