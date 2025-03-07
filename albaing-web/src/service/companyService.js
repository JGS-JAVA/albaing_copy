import axios from 'axios';

const companyService = {
    /**
     * 회사 정보를 가져오는 함수
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Object>} 회사 정보
     */
    getCompanyInfo: (companyId) => {
        return axios.get(`/api/companies/${companyId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error('회사 정보를 불러오는 중 오류가 발생했습니다');
            });
    },

    /**
     * 회사의 채용 공고 목록을 가져오는 함수
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Array>} 채용 공고 목록
     */
    getJobPostsByCompanyId: (companyId) => {
        return axios.get(`/api/jobs/company/${companyId}`)
            .then(response => response.data)
            .catch(error => {
                throw new Error('채용 정보를 불러오는 중 오류가 발생했습니다');
            });
    },

    /**
     * 회사의 리뷰 목록을 가져오는 함수
     * @param {number} companyId - 회사 ID
     * @returns {Promise<Array>} 리뷰 목록
     */
    getReviewsByCompanyId: (companyId) => {
        return axios.get(`/api/companies/${companyId}/reviews`)
            .then(response => response.data)
            .catch(error => {
                throw new Error('리뷰를 불러오는 중 오류가 발생했습니다');
            });
    },

    /**
     * 리뷰를 작성하는 함수
     * @param {number} companyId - 회사 ID
     * @param {Object} reviewData - 리뷰 데이터
     * @returns {Promise<Object>} 작성된 리뷰 정보
     */
    addReview: (companyId, reviewData) => {
        return axios.post(`/api/companies/${companyId}/reviews`, {
            ...reviewData,
            companyId: parseInt(companyId)
        }, {
            withCredentials: true
        })
            .then(response => response.data)
            .catch(error => {
                if (error.response?.status === 401) {
                    throw new Error('리뷰를 작성하려면 로그인이 필요합니다');
                }
                throw new Error('리뷰 등록에 실패했습니다');
            });
    }
};

export default companyService;