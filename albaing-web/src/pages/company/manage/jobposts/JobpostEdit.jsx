import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

const PreviewCard = ({ data }) => {
    // 기본주소와 상세주소를 합쳐서 전체 주소 표시
    const fullAddress =
        data.jobPostWorkPlace + (data.jobPostWorkPlaceDetail ? ` ${data.jobPostWorkPlaceDetail}` : '');
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {data.jobPostTitle || '제목 없음'}
                </h2>
                <div className="grid grid-cols-3 gap-4 text-gray-600 text-sm">
                    <div><strong>직종 카테고리:</strong> {data.jobPostJobCategory || '-'}</div>
                    <div><strong>고용형태:</strong> {data.jobPostJobType || '-'}</div>
                    <div><strong>근무기간:</strong> {data.jobPostWorkingPeriod || '-'}</div>
                    <div><strong>근무요일:</strong> {data.jobWorkSchedule || '-'}</div>
                    <div><strong>근무시간:</strong> {data.jobPostShiftHours || '-'}</div>
                    <div><strong>급여:</strong> {data.jobPostSalary || '-'}</div>
                </div>
            </div>
            <div className="mb-4 space-y-1 text-sm text-gray-600">
                <p><strong>근무지:</strong> {fullAddress || '-'}</p>
                <p><strong>마감일:</strong> {data.jobPostDueDate || '-'}</p>
                <p><strong>연락처:</strong> {data.jobPostContactNumber || '-'}</p>
                <p><strong>학력요건:</strong> {data.jobPostRequiredEducations || '-'}</p>
            </div>
            {data.jobPostOptionalImage && (
                <div className="mt-4">
                    <img
                        src={data.jobPostOptionalImage}
                        alt="채용공고 이미지"
                        className="w-full h-auto object-contain rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
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
    const shiftHours = ['무관', '오전(06:00~12:00)', '오후(12:00~18:00)', '저녁(18:00~24:00)', '새벽(00:00~06:00)'];

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

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
            .get(`http://localhost:8080/api/jobs/${validJobPostId}`)
            .then((response) => {
                if (Number(response.data.companyId) !== validCompanyId) {
                    setError('수정 권한이 없습니다.');
                    return;
                }
                setFormData({ ...response.data });
                setIsAuthorized(true);
            })
            .catch((err) => {
                setError('채용공고를 불러오는 중 오류가 발생했습니다.');
                console.error('Error fetching job post:', err);
            });
    }, [jobPostId, userData, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.jobPostJobCategory) {
            setError('직종 카테고리를 선택해주세요.');
            return;
        }
        // 전체 주소 재조합
        const fullAddress = formData.jobPostWorkPlace +
            (formData.jobPostWorkPlaceDetail ? ` ${formData.jobPostWorkPlaceDetail}` : '');
        const updatedFormData = { ...formData, jobPostWorkPlaceFullAddress: fullAddress };
        setLoading(true);
        setError(null);
        axios
            .put(`http://localhost:8080/api/jobs/${jobPostId}`, updatedFormData)
            .then(() => {
                setLoading(false);
                navigate(`/jobs/${jobPostId}`);
            })
            .catch((error) => {
                setLoading(false);
                setError('채용공고 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('Error updating job post:', error);
            });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-red-100 border border-red-400 text-red-700 rounded mt-8">
                {error}
            </div>
        );
    }
    if (!isAuthorized) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-gray-100 to-gray-50 shadow-lg rounded-lg mt-10">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">채용공고 수정</h1>
                <button onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                    취소
                </button>
            </div>
            <div className="mb-6">
                <button onClick={() => setActiveTab('edit')}
                        className={`px-4 py-2 mr-2 ${activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'} rounded`}>
                    수정
                </button>
                <button onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'} rounded`}>
                    미리보기
                </button>
            </div>
            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            {activeTab === 'edit' ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="jobPostTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            채용공고 제목 *
                        </label>
                        <input type="text" id="jobPostTitle" name="jobPostTitle" value={formData.jobPostTitle || ''}
                               onChange={handleChange} required
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="jobPostOptionalImage" className="block text-sm font-medium text-gray-700 mb-1">
                            이미지 URL
                        </label>
                        <input type="text" id="jobPostOptionalImage" name="jobPostOptionalImage" value={formData.jobPostOptionalImage || ''}
                               onChange={handleChange}
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="jobPostContactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            연락처
                        </label>
                        <input type="text" id="jobPostContactNumber" name="jobPostContactNumber" value={formData.jobPostContactNumber || ''}
                               onChange={handleChange}
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="연락 가능한 전화번호를 입력하세요" />
                    </div>
                    <div>
                        <label htmlFor="jobPostRequiredEducations" className="block text-sm font-medium text-gray-700 mb-1">
                            필요 학력
                        </label>
                        <input type="text" id="jobPostRequiredEducations" name="jobPostRequiredEducations" value={formData.jobPostRequiredEducations || ''}
                               onChange={handleChange}
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="예: 고졸 이상, 무관 등" />
                    </div>
                    <div>
                        <label htmlFor="jobPostJobCategory" className="block text-sm font-medium text-gray-700 mb-1">
                            직종 카테고리 *
                        </label>
                        <select id="jobPostJobCategory" name="jobPostJobCategory" value={formData.jobPostJobCategory || ''}
                                onChange={handleChange} required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">카테고리를 선택하세요</option>
                            {jobCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="jobPostJobType" className="block text-sm font-medium text-gray-700 mb-1">
                            고용형태 *
                        </label>
                        <select id="jobPostJobType" name="jobPostJobType" value={formData.jobPostJobType || ''}
                                onChange={handleChange} required
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">근무 형태 선택</option>
                            {jobTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="jobPostWorkingPeriod" className="block text-sm font-medium text-gray-700 mb-1">
                            근무기간
                        </label>
                        <select id="jobPostWorkingPeriod" name="jobPostWorkingPeriod" value={formData.jobPostWorkingPeriod || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">근무 기간 선택</option>
                            {workingPeriods.map((period) => (
                                <option key={period} value={period}>{period}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="jobWorkSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                            근무요일
                        </label>
                        <select id="jobWorkSchedule" name="jobWorkSchedule" value={formData.jobWorkSchedule || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">근무 요일 선택</option>
                            {workSchedules.map((schedule) => (
                                <option key={schedule} value={schedule}>{schedule}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="jobPostShiftHours" className="block text-sm font-medium text-gray-700 mb-1">
                            근무시간
                        </label>
                        <select id="jobPostShiftHours" name="jobPostShiftHours" value={formData.jobPostShiftHours || ''}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">근무 시간 선택</option>
                            {shiftHours.map((shift) => (
                                <option key={shift} value={shift}>{shift}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="jobPostSalary" className="block text-sm font-medium text-gray-700 mb-1">
                            급여
                        </label>
                        <input type="text" id="jobPostSalary" name="jobPostSalary" value={formData.jobPostSalary || ''}
                               onChange={handleChange}
                               placeholder="예: 시급 10,000원, 월 250만원 등"
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* 근무지 (수정 불가) - 주소 검색 및 상세 주소 관련 코드 제거 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            근무지 (수정 불가)
                        </label>
                        <input type="text" readOnly
                               value={
                                   formData.jobPostWorkPlace +
                                   (formData.jobPostWorkPlaceDetail ? ` ${formData.jobPostWorkPlaceDetail}` : '')
                                   || ''
                               }
                               className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label htmlFor="jobPostDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            마감일
                        </label>
                        <input type="date" id="jobPostDueDate" name="jobPostDueDate" value={formData.jobPostDueDate || ''}
                               onChange={handleChange}
                               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="px-6 py-4 bg-gray-50 text-right flex justify-end space-x-3">
                        <button type="button" onClick={handleCancel}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                            취소
                        </button>
                        <button type="submit" disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors">
                            {loading ? '처리 중...' : '수정하기'}
                        </button>
                    </div>
                </form>
            ) : (
                <PreviewCard data={formData} />
            )}
        </div>
    );
};

export default JobPostEdit;
