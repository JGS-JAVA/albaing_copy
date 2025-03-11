import axios from "axios";


const API_SCRAP_URL = "http://localhost:8080/api/scrap";

const apiScrapService = {
    // 스크랩 추가
    addScrap: (userId, jobPostId) => {
        axios
            .post(`${API_SCRAP_URL}/add/${userId}/${jobPostId}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("스크랩 추가 실패:", err);
            });
    },

    // 스크랩 삭제
    removeScrap: (userId, jobPostId) => {
        return axios
            .delete(`${API_SCRAP_URL}/remove/${userId}/${jobPostId}`)
            .then((res) => {
                jobPostId(res.data);})
            .catch((err) => {
                console.error("스크랩 삭제 실패:", err);
            });
    },

    // 특정 사용자의 스크랩 목록 조회
    getUserScraps: (userId) => {
        return axios
            .get(`${API_SCRAP_URL}/${userId}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error("스크랩 목록 조회 실패:", err);
            });
    },
};

export default apiScrapService;
