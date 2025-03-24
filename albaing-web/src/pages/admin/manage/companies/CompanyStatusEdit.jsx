import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../../../components';
import AdminLayout from '../../AdminLayout';

const CompanyStatusEdit = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCompanyDetail();
    }, [companyId]);

    const fetchCompanyDetail = () => {
        setLoading(true);
        axios.get(`/api/admin/companies/${companyId}`)
            .then(response => {
                setCompany(response.data);
                setSelectedStatus(response.data.companyApprovalStatus || 'approving');
                setLoading(false);
            })
            .catch(error => {
                setError('기업 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.patch(`/api/admin/companies/${companyId}/approval`, { status: selectedStatus })
            .then(() => {
                navigate(`/admin/companies/${companyId}`);
            })
            .catch(error => {
                setError('승인 상태 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const statusOptions = [
        { value: 'approved', label: '승인', description: '기업 계정을 승인합니다. 모든 기능을 사용할 수 있습니다.' },
        { value: 'approving', label: '대기', description: '승인 대기 상태로 유지합니다. 로그인이 제한됩니다.' },
        { value: 'hidden', label: '숨김', description: '기업 계정을 숨깁니다. 로그인 및 모든 기능이 제한됩니다.' }
    ];

    return (
        <AdminLayout>
            {loading ? (
                <LoadingSpinner message="기업 정보를 불러오는 중..." />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : company ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">기업 승인 상태 변경</h1>

                        <div className="mb-4">
                            <p className="font-medium text-gray-800">{company.companyName}</p>
                            <p className="text-sm text-gray-600">사업자등록번호: {company.companyRegistrationNumber}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
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

                            <div className="mt-8 flex justify-end space-x-3">
                                <Link
                                    to={`/admin/companies/${companyId}`}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    취소
                                </Link>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    변경
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <ErrorMessage message="기업 정보를 찾을 수 없습니다." />
            )}
        </AdminLayout>
    );
};

export default CompanyStatusEdit;