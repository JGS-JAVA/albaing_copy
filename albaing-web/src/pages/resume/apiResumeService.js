import axios from 'axios';

// 이력서 조회
export const getResume = (resumeId) => {
    return axios.get(`/api/resume/${resumeId}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('이력서 조회 오류:', error);
            throw error;
        });
};

// 이력서 수정
export const updateResume = (resumeId, resumeUpdateRequest) => {
    return axios.put(`/api/resume/update/${resumeId}`, resumeUpdateRequest)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('이력서 수정 오류:', error);
            throw error;
        });
};

// 이력서 정보 포맷팅 유틸리티 함수
export const formatEducation = (edu) => {
    if (!edu) return '등록된 학력 정보가 없습니다.';

    const schoolInfo = edu.eduSchool ? `${edu.eduSchool}` : '';
    const majorInfo = edu.eduMajor ? ` (${edu.eduMajor})` : '';
    const periodInfo = (edu.eduAdmissionYear || edu.eduGraduationYear)
        ? ` | ${edu.eduAdmissionYear || '?'} - ${edu.eduGraduationYear || '재학 중'}`
        : '';
    const degreeInfo = edu.eduDegree ? ` | ${edu.eduDegree}` : '';

    return schoolInfo + majorInfo + periodInfo + degreeInfo;
};

export const formatCareer = (career) => {
    if (!career) return '등록된 경력 정보가 없습니다.';

    if (career.careerIsCareer === '신입') {
        return '신입';
    }

    const companyInfo = career.careerCompanyName ? `${career.careerCompanyName}` : '';
    const periodInfo = (career.careerJoinDate || career.careerQuitDate)
        ? ` | ${career.careerJoinDate || '?'} - ${career.careerQuitDate || '재직 중'}`
        : '';
    const descInfo = career.careerJobDescription ? ` | ${career.careerJobDescription}` : '';

    return companyInfo + periodInfo + descInfo;
};