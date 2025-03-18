import React, { useState, useEffect } from 'react';
import {getAllSchools} from "../../service/apiEducationService";
import {getAllMajors} from "../../service/apiEducationService";

const EducationModal = ({ educationData, majorData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        eduDegree: '',
        eduStatus: '',
        eduSchool: '',
        eduMajor: '',
        eduAdmissionYear: '',
        eduGraduationYear: ''
    });

    //학교
    const [searchTerm, setSearchTerm] = useState("");
    const [schoolList, setSchoolList] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [isManualSchoolInput, setIsManualSchoolInput] = useState(false);

    //전공
    const [majorSearchTerm, setMajorSearchTerm] = useState("");
    const [majorList, setMajorList] = useState([]);
    const [filteredMajors, setFilteredMajors] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);
    const [isManualMajorInput, setIsManualMajorInput] = useState(false);

    //학교 정보 가져오기
    useEffect(() => {
        const fetchSchools = () => {
            getAllSchools()
                .then((schools) => {
                    setSchoolList(schools);
                })
                .catch((error) => {
                    console.error('학교 데이터를 가져오는 중 오류 발생:', error);
                });
        };
        fetchSchools();
    }, []);

    //전공 정보 가져오기
    useEffect(() => {
        const fetchMajors = () => {
            getAllMajors()
                .then((majors) => {
                    setMajorList(majors);
                })
                .catch((error) => {
                    console.error('전공 데이터를 가져오는 중 오류 발생:', error);
                });
        };
        fetchMajors();
    }, []);

    // 학교 검색어 입력 시 필터링 - 대학교/고등학교 필터링
    useEffect(() => {
        if (searchTerm === "") {
            setFilteredSchools([]);
            return;
        }

        let filtered = schoolList.filter((school) =>
            school.name.includes(searchTerm)
        );

        // 학위에 따라 학교 필터링
        if (formData.eduDegree === '고등학교') {
            filtered = filtered.filter(school => school.type === '고등학교');
        } else if (['전문학사', '학사', '석사', '박사'].includes(formData.eduDegree)) {
            filtered = filtered.filter(school => school.type === '대학교' || school.type === '대학원');
        }

        setFilteredSchools(filtered);
    }, [searchTerm, schoolList, formData.eduDegree]);

    // 전공 검색어 입력 시 필터링
    useEffect(() => {
        if (majorSearchTerm === "") {
            setFilteredMajors([]);
            return;
        }

        const filtered = majorList.filter((major) => {
            // facilName을 ','로 분리하여 각 전공 이름에 대해 검색어가 포함되는지 체크
            if (major.name) {
                const majorNames = major.name.split(','); // ','로 전공 이름 분리
                return majorNames.some((name) => name.toLowerCase().includes(majorSearchTerm.toLowerCase()));
            }
            return false;
        });

        setFilteredMajors(filtered);
    }, [majorSearchTerm, majorList]);

    const handleSelect = (school) => {
        setSelectedSchool(school);
        setSearchTerm(school.name); // 선택한 학교 이름을 입력창에 표시
        setFilteredSchools([]); // 리스트 닫기
        setIsManualSchoolInput(false); // 수동 입력 모드 비활성화
    };

    const handleMajorSelect = (major) => {
        setSelectedMajor(major);
        setMajorSearchTerm(major.name); // 선택한 전공 이름을 입력창에 표시
        setFilteredMajors([]); // 리스트 닫기
        setIsManualMajorInput(false); // 수동 입력 모드 비활성화
    };

    // 수동 입력 모드 토글 함수
    const toggleManualSchoolInput = () => {
        setIsManualSchoolInput(!isManualSchoolInput);
        if (!isManualSchoolInput) {
            setSelectedSchool(null);
            setSearchTerm("");
        }
    };

    const toggleManualMajorInput = () => {
        setIsManualMajorInput(!isManualMajorInput);
        if (!isManualMajorInput) {
            setSelectedMajor(null);
            setMajorSearchTerm("");
        }
    };

    const degreeTypes = ['고등학교', '전문학사', '학사', '석사', '박사', '기타'];

    const statusTypes = ['졸업', '재학중', '휴학중', '중퇴', '수료'];

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        if (educationData) {
            setFormData({
                eduDegree: educationData.eduDegree || '',
                eduStatus: educationData.eduStatus || '',
                eduSchool: educationData.eduSchool || '',
                eduAdmissionYear: educationData.eduAdmissionYear || '',
                eduGraduationYear: educationData.eduGraduationYear || ''
            });
            setSearchTerm(educationData.eduSchool || '');
        }
        if (majorData) {
            setFormData(prev => ({
                ...prev,
                eduMajor: majorData.eduMajor || ''
            }));
            setMajorSearchTerm(majorData.eduMajor || '');
        }
    }, [educationData, majorData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 학위 변경 시 학교 검색어 초기화
        if (name === 'eduDegree') {
            setSearchTerm('');
            setSelectedSchool(null);
            setFilteredSchools([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 학교명 체크 - 수동 입력 모드인 경우에는 검색어를 사용
        if (!isManualSchoolInput && !selectedSchool && !searchTerm) {
            alert('학교명을 입력해주세요.');
            return;
        }

        // 전공 체크 - 수동 입력 모드인 경우에는 검색어를 사용
        if (!isManualMajorInput && !selectedMajor && !majorSearchTerm) {
            alert('전공을 입력해주세요.');
            return;
        }

        // 학위 선택 필수
        if (!formData.eduDegree) {
            alert('학위를 선택해주세요.');
            return;
        }

        // 재학상태 선택 필수
        if (!formData.eduStatus) {
            alert('재학상태를 선택해주세요.');
            return;
        }

        // 입학년도 필수
        if (!formData.eduAdmissionYear) {
            alert('입학년도를 선택해주세요.');
            return;
        }

        // 재학중이나 휴학중이 아닌 경우, 졸업년도도 필수로 입력받음
        if (formData.eduStatus !== '재학중' && formData.eduStatus !== '휴학중' && !formData.eduGraduationYear) {
            alert('졸업년도를 선택해주세요.');
            return;
        }

        if (formData.eduAdmissionYear && formData.eduGraduationYear &&
            parseInt(formData.eduAdmissionYear) > parseInt(formData.eduGraduationYear)) {
            alert('입학년도는 졸업년도보다 빨라야 합니다.');
            return;
        }

        // 저장할 때 formData에 학교명과 전공명 업데이트
        const updatedFormData = {
            ...formData,
            eduSchool: isManualSchoolInput ? searchTerm : (selectedSchool ? selectedSchool.name : searchTerm),
            eduMajor: isManualMajorInput ? majorSearchTerm : (selectedMajor ? selectedMajor.name : majorSearchTerm)
        };

        if (formData.eduStatus === '재학중' || formData.eduStatus === '휴학중') {
            updatedFormData.eduGraduationYear = formData.eduAdmissionYear; // 임시로 입학년도와 같게 설정
        }

        onSave(updatedFormData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slideIn">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">
                        <span className="text-blue-600 mr-2">✏️</span>
                        학력 정보 {educationData ? '수정' : '추가'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="eduDegree" className="block text-sm font-medium text-gray-700">
                                    학위 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="eduDegree"
                                    name="eduDegree"
                                    value={formData.eduDegree}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">선택</option>
                                    {degreeTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="eduStatus" className="block text-sm font-medium text-gray-700">
                                    재학상태 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="eduStatus"
                                    name="eduStatus"
                                    value={formData.eduStatus}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">선택</option>
                                    {statusTypes.map((type, index) => (
                                        <option key={index} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="eduSchool" className="block text-sm font-medium text-gray-700">
                                    학교명 <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={toggleManualSchoolInput}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    {isManualSchoolInput ? '목록에서 선택하기' : '직접 입력하기'}
                                </button>
                            </div>
                            <input
                                type="text"
                                id="eduSchool"
                                name="eduSchool"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder={isManualSchoolInput ? "학교명을 직접 입력해주세요" : "학교 검색"}
                                required
                            />
                            {!isManualSchoolInput && filteredSchools.length > 0 && (
                                <ul className="mt-2 border border-gray-200 rounded-lg shadow-sm bg-white" style={{maxHeight: "150px", overflowY: "auto", padding: 0}}>
                                    {filteredSchools.map((school, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSelect(school)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            style={{
                                                backgroundColor: selectedSchool?.name === school.name ? "#f0f9ff" : "white",
                                                borderBottom: index < filteredSchools.length - 1 ? "1px solid #eee" : "none"
                                            }}
                                        >
                                            {school.name} ({school.type})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="eduMajor" className="block text-sm font-medium text-gray-700">
                                    전공 <span className="text-red-500">*</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={toggleManualMajorInput}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    {isManualMajorInput ? '목록에서 선택하기' : '직접 입력하기'}
                                </button>
                            </div>
                            <input
                                type="text"
                                id="eduMajor"
                                name="eduMajor"
                                value={majorSearchTerm}
                                onChange={(e) => setMajorSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                placeholder={isManualMajorInput ? "전공을 직접 입력해주세요" : "전공 검색"}
                                required
                            />
                            {!isManualMajorInput && filteredMajors.length > 0 && (
                                <ul className="mt-2 border border-gray-200 rounded-lg shadow-sm bg-white" style={{maxHeight: "150px", overflowY: "auto", padding: 0}}>
                                    {filteredMajors.map((major, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleMajorSelect(major)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            style={{
                                                backgroundColor: selectedMajor?.name === major.name ? "#f0f9ff" : "white",
                                                borderBottom: index < filteredMajors.length - 1 ? "1px solid #eee" : "none"
                                            }}
                                        >
                                            {major.name} ({major.type})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="eduAdmissionYear" className="block text-sm font-medium text-gray-700">
                                    입학년도 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="eduAdmissionYear"
                                    name="eduAdmissionYear"
                                    value={formData.eduAdmissionYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="eduGraduationYear" className="block text-sm font-medium text-gray-700">
                                    졸업년도 {formData.eduStatus !== '재학중' && formData.eduStatus !== '휴학중' && <span className="text-red-500">*</span>}
                                </label>
                                <select
                                    id="eduGraduationYear"
                                    name="eduGraduationYear"
                                    value={formData.eduGraduationYear}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    disabled={formData.eduStatus === '재학중' || formData.eduStatus === '휴학중'}
                                >
                                    <option value="">선택</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all font-medium"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all font-medium"
                        >
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EducationModal;