import axios from 'axios';

const apiCompanyService = {
    /**
     * 모든 회사 목록을 가져옵니다.
     * @returns {Promise<Array>} 회사 목록
     */
    getAllCompanies: () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/companies')
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    /**
     * 회사 ID로 특정 회사 정보를 가져옵니다.
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Object>} 회사 정보
     */
    getCompanyInfo: (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/companies/${companyId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    /**
     * 특정 회사의 채용공고 목록을 가져옵니다.
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Array>} 채용공고 목록
     */
    getJobPostsByCompanyId: (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/jobs/company/${companyId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    /**
     * 특정 회사의 리뷰 목록을 가져옵니다.
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Array>} 리뷰 목록
     */
    getReviewsByCompanyId: (companyId) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/companies/${companyId}/reviews`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },

    /**
     * 회사명으로 회사를 검색합니다.
     * @param {string} keyword - 검색어
     * @returns {Promise<Array>} 검색 결과 회사 목록
     */
    searchCompaniesByName: (keyword) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/companies/search?keyword=${encodeURIComponent(keyword)}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default apiCompanyService;