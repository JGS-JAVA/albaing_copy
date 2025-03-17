import axios from 'axios';
import { getErrorMessage } from '../components/ErrorHandler';

// API 기본 URL 설정
const API_URL = process.env.REACT_APP_API_URL || '';

const apiResumeService = {
    // 이력서 ID로 조회
    getResume: (resumeId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/api/resume/${resumeId}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('이력서 조회 오류:', getErrorMessage(error));
                    reject(error);
                });
        });
    },

    // 사용자 ID로 이력서 조회
    getResumeByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/api/resume/user/${userId}`, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('이력서 조회 오류:', getErrorMessage(error));
                    reject(error);
                });
        });
    },

    // 이력서 업데이트
    updateResume: (resumeId, resumeData) => {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/api/resume/update/${resumeId}`, resumeData, { withCredentials: true })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('이력서 업데이트 오류:', getErrorMessage(error));
                    reject(error);
                });
        });
    },
};

export default apiResumeService;