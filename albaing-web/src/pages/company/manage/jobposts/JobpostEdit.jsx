import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../../../../components';

const PreviewCard = ({ data }) => {
    const fullAddress =
        data.jobPostWorkPlace +
        (data.jobPostWorkPlaceDetail ? ` ${data.jobPostWorkPlaceDetail}` : '');
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {data.jobPostTitle || '제목 없음'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 text-sm">
                    <div>
                        <strong>직종 카테고리:</strong> {data.jobPostJobCategory || '-'}
                    </div>
                    <div>
                        <strong>고용형태:</strong> {data.jobPostJobType || '-'}
                    </div>
                    <div>
                        <strong>근무기간:</strong> {data.jobPostWorkingPeriod || '-'}
                    </div>
                    <div>
                        <strong>근무요일:</strong> {data.jobWorkSchedule || '-'}
                    </div>
                    <div>
                        <strong>근무시간:</strong> {data.jobPostShiftHours || '-'}
                    </div>
                    <div>
                        <strong>급여:</strong> {data.jobPostSalary || '-'}
                    </div>
                </div>
            </div>
            <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p>
                    <strong>근무지:</strong> {fullAddress || '-'}
                </p>
                <p>
                    <strong>마감일:</strong> {data.jobPostDueDate || '-'}
                </p>
                <p>
                    <strong>연락처:</strong> {data.jobPostContactNumber || '-'}
                </p>
                <p>
                    <strong>학력요건:</strong> {data.jobPostRequiredEducations || '-'}
                </p>
            </div>
            {data.jobPostOptionalImage && (
                <div className="mt-4">
                    <img
                        src={data.jobPostOptionalImage}
                        alt="채용공고 이미지"
                        className="w-full h-auto object-contain rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                'https://via.placeholder.com/600x400?text=No+Image';
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const JobPostEdit = () => {
    const navigate = useNavigate();
    const { jobPostId } = useParams();
    const { userData } = useAuth();
    const companyId = userData?.companyId;

    const jobCategories = [
        '외식/음료',
        '유통/판매',
        '문화/여가생활',
        '서비스',
        '사무/회계',
        '고객상담/리서치',
        '생산/건설/노무',
        'IT/기술',
        '디자인',
        '미디어',
        '운전/배달',
        '병원/간호/연구',
        '교육/강사',
    ];
    const jobTypes = ['알바', '정규직', '계약직', '파견직', '인턴'];
    const workingPeriods = ['무관', '하루', '1일~1개월', '1~3개월', '3~6개월', '6개월이상'];
    const workSchedules = ['무관', '평일', '주말'];
    const shiftHours = [
        '무관',
        '오전(06:00~12:00)',
        '오후(12:00~18:00)',
        '저녁(18:00~24:00)',
        '새벽(00:00~06:00)',
    ];

    const [activeTab, setActiveTab] = useState('edit');
    const [formData, setFormData] = useState({
        companyId: companyId,
        jobPostTitle: '',
        jobPostOptionalImage: '',
        jobPostContactNumber: '',
        jobPostRequiredEducations: '',
        jobPostJobCategory: '',
        jobPostJobType: '',
        jobPostWorkingPeriod: '',
        jobWorkSchedule: '',
        jobPostShiftHours: '',
        jobPostSalary: '',
        jobPostWorkPlace: '', // 기본 주소 (수정 불가)
        jobPostWorkPlaceDetail: '', // 상세 주소 (수정 불가)
        jobPostWorkPlaceFullAddress: '',
        jobPostStatus: true,
        jobPostDueDate: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // 급여 입력 관련 상태 (모든 금액은 '원' 단위로 표시)
    const [salaryType, setSalaryType] = useState('월급');
    const [salaryAmount, setSalaryAmount] = useState('');
    const [salaryComparison, setSalaryComparison] = useState('');

    // 근무시간 직접 입력 상태
    const [showCustomShiftHours, setShowCustomShiftHours] = useState(false);
    const [customShiftHours, setCustomShiftHours] = useState('');

    // 공고 상세 데이터 로드
    useEffect(() => {
        if (!userData) return;
        const validJobPostId = Number(jobPostId);
        const validCompanyId = userData?.companyId ? Number(userData.companyId) : null;
        if (!validJobPostId) {
            setError('올바른 공고 ID가 아닙니다.');
            navigate('/');
            return;
        }
        axios
            .get(`/api/jobs/${validJobPostId}`)
            .then((response) => {
                if (Number(response.data.companyId) !== validCompanyId) {
                    setError('수정 권한이 없습니다.');
                    return;
                }
                setFormData({ ...response.data });
                // (필요시 기존 급여값에서 salaryType, salaryAmount를 파싱할 수 있음)
                setIsAuthorized(true);
                setLoading(false);
            })
            .catch(() => {
                setError('채용공고를 불러오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    }, [jobPostId, userData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 급여 입력 변화에 따라 formData.jobPostSalary 업데이트 (모든 금액을 '원' 단위로)
    useEffect(() => {
        const formattedSalary = salaryAmount
            ? `${salaryType} ${Number(salaryAmount).toLocaleString()}원`
            : '';
        setFormData((prev) => ({ ...prev, jobPostSalary: formattedSalary }));
    }, [salaryType, salaryAmount]);

    const handleSalaryTypeChange = (e) => {
        setSalaryType(e.target.value);
        setSalaryComparison('');
    };

    const handleSalaryAmountChange = (e) => {
        setSalaryAmount(e.target.value);
        setSalaryComparison('');
    };

    const compareSalary = () => {
        if (!salaryAmount) {
            setSalaryComparison('금액을 입력해주세요.');
            return;
        }
        const inputAmount = parseInt(salaryAmount, 10);
        let reference = null;
        if (salaryType === '시급') {
            reference = 10030;
        } else if (salaryType === '일급') {
            reference = 80240;
        } else if (salaryType === '월급') {
            reference = 2096270;
        } else {
            setSalaryComparison('비교 기능은 시급, 일급, 월급에만 지원됩니다.');
            return;
        }
        if (inputAmount < reference) {
            setSalaryComparison(
                `입력하신 ${salaryType} 금액이 기준보다 낮습니다. (기준: ${reference.toLocaleString()}원)`
            );
        } else if (inputAmount === reference) {
            setSalaryComparison(
                `입력하신 ${salaryType} 금액이 기준과 동일합니다. (기준: ${reference.toLocaleString()}원)`
            );
        } else {
            setSalaryComparison(
                `입력하신 ${salaryType} 금액이 기준보다 높습니다. (기준: ${reference.toLocaleString()}원)`
            );
        }
    };

    // 근무시간 드롭다운 처리 (직접 입력 선택 시 입력 필드 표시)
    const handleShiftHoursChange = (e) => {
        const value = e.target.value;
        if (value === '직접 입력') {
            setShowCustomShiftHours(true);
            setFormData((prev) => ({ ...prev, jobPostShiftHours: customShiftHours }));
        } else {
            setShowCustomShiftHours(false);
            setCustomShiftHours('');
            setFormData((prev) => ({ ...prev, jobPostShiftHours: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.jobPostJobCategory) {
            setError('직종 카테고리를 선택해주세요.');
            return;
        }
        const fullAddress =
            formData.jobPostWorkPlace +
            (formData.jobPostWorkPlaceDetail
                ? ` ${formData.jobPostWorkPlaceDetail}`
                : '');
        const updatedFormData = { ...formData, jobPostWorkPlaceFullAddress: fullAddress };
        setLoading(true);
        setError(null);
        axios
            .put(`/api/jobs/${jobPostId}`, updatedFormData)
            .then(() => {
                setLoading(false);
                navigate(-1);
            })
            .catch(() => {
                setLoading(false);
                setError('채용공고 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (error && !isAuthorized) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg mt-8">
                {error}
                <div className="mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !isAuthorized) {
        return <LoadingSpinner message="채용 공고 정보를 불러오는 중..." />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-gray-800">채용공고 수정</h1>
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    취소
                </button>
            </div>

            <div className="mb-6">
                <div className="inline-flex rounded-lg">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`px-4 py-2 rounded-l-lg ${
                            activeTab === 'edit'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        } transition-colors`}
                    >
                        수정
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 rounded-r-lg ${
                            activeTab === 'preview'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        } transition-colors`}
                    >
                        미리보기
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}

            {activeTab === 'edit' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 채용공고 제목 */}
                    <div>
                        <label
                            htmlFor="jobPostTitle"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            채용공고 제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="jobPostTitle"
                            name="jobPostTitle"
                            value={formData.jobPostTitle || ''}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="채용 제목을 입력하세요"
                        />
                    </div>

                    {/* 이미지 URL */}
                    <div>
                        <label
                            htmlFor="jobPostOptionalImage"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            이미지 URL
                        </label>
                        <input
                            type="text"
                            id="jobPostOptionalImage"
                            name="jobPostOptionalImage"
                            value={formData.jobPostOptionalImage || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="이미지 URL을 입력하세요"
                        />
                    </div>

                    {/* 연락처 */}
                    <div>
                        <label
                            htmlFor="jobPostContactNumber"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            연락처
                        </label>
                        <input
                            type="text"
                            id="jobPostContactNumber"
                            name="jobPostContactNumber"
                            value={formData.jobPostContactNumber || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="연락 가능한 전화번호를 입력하세요"
                        />
                    </div>

                    {/* 필요 학력 */}
                    <div>
                        <label
                            htmlFor="jobPostRequiredEducations"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            필요 학력
                        </label>
                        <input
                            type="text"
                            id="jobPostRequiredEducations"
                            name="jobPostRequiredEducations"
                            value={formData.jobPostRequiredEducations || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="예: 고졸 이상, 무관 등"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 직종 카테고리 */}
                        <div>
                            <label
                                htmlFor="jobPostJobCategory"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                직종 카테고리 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="jobPostJobCategory"
                                name="jobPostJobCategory"
                                value={formData.jobPostJobCategory || ''}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">카테고리 선택</option>
                                {jobCategories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 고용형태 */}
                        <div>
                            <label
                                htmlFor="jobPostJobType"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                고용형태 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="jobPostJobType"
                                name="jobPostJobType"
                                value={formData.jobPostJobType || ''}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">근무 형태 선택</option>
                                {jobTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 근무기간 */}
                        <div>
                            <label
                                htmlFor="jobPostWorkingPeriod"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                근무기간
                            </label>
                            <select
                                id="jobPostWorkingPeriod"
                                name="jobPostWorkingPeriod"
                                value={formData.jobPostWorkingPeriod || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">근무 기간 선택</option>
                                {workingPeriods.map((period) => (
                                    <option key={period} value={period}>
                                        {period}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 근무요일 */}
                        <div>
                            <label
                                htmlFor="jobWorkSchedule"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                근무요일
                            </label>
                            <select
                                id="jobWorkSchedule"
                                name="jobWorkSchedule"
                                value={formData.jobWorkSchedule || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="">근무 요일 선택</option>
                                {workSchedules.map((schedule) => (
                                    <option key={schedule} value={schedule}>
                                        {schedule}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 근무시간 - 직접 입력 기능 포함 */}
                        <div>
                            <label
                                htmlFor="jobPostShiftHours"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                근무시간
                            </label>
                            <div className="flex">
                                <select
                                    id="jobPostShiftHours"
                                    name="jobPostShiftHours"
                                    value={
                                        showCustomShiftHours
                                            ? '직접 입력'
                                            : formData.jobPostShiftHours || ''
                                    }
                                    onChange={handleShiftHoursChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    <option value="">근무 시간 선택</option>
                                    {shiftHours.map((shift) => (
                                        <option key={shift} value={shift}>
                                            {shift}
                                        </option>
                                    ))}
                                    <option value="직접 입력">직접 입력</option>
                                </select>
                                {showCustomShiftHours && (
                                    <input
                                        type="text"
                                        value={customShiftHours}
                                        onChange={(e) => {
                                            setCustomShiftHours(e.target.value);
                                            setFormData((prev) => ({
                                                ...prev,
                                                jobPostShiftHours: e.target.value,
                                            }));
                                        }}
                                        placeholder="근무시간 입력"
                                        className="ml-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                급여
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <select
                                        id="salaryType"
                                        value={salaryType}
                                        onChange={handleSalaryTypeChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        required
                                    >
                                        <option value="시급">시급</option>
                                        <option value="일급">일급</option>
                                        <option value="주급">주급</option>
                                        <option value="월급">월급</option>
                                        <option value="연봉">연봉</option>
                                    </select>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        id="salaryAmount"
                                        value={salaryAmount}
                                        onChange={handleSalaryAmountChange}
                                        placeholder="숫자만 입력"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={compareSalary}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        비교
                                    </button>
                                </div>
                            </div>
                            {salaryComparison && (
                                <div className="mt-2 text-sm text-gray-600">
                                    {salaryComparison}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            근무지 (수정 불가)
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={
                                formData.jobPostWorkPlace +
                                (formData.jobPostWorkPlaceDetail
                                    ? ` ${formData.jobPostWorkPlaceDetail}`
                                    : '') || ''
                            }
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="jobPostDueDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            마감일
                        </label>
                        <input
                            type="date"
                            id="jobPostDueDate"
                            name="jobPostDueDate"
                            value={formData.jobPostDueDate || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? '처리 중...' : '수정하기'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-6">
                    <PreviewCard data={formData} />
                    <div className="text-right">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            수정하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobPostEdit;
