import axios from "axios";

const API_APPLICATION_URL = "http://localhost:8080/api/applications";

const apiJobApplicationService = {
    getJobApplicationsByResume: function (resumeId, setApplications) {
        axios
            .get(`${API_APPLICATION_URL}/resume/${resumeId}`)
            .then((res) => {
                setApplications(res.data); // API에서 받은 데이터를 상태 업데이트
                console.log("지원 목록 가져오기 성공", res.data);
            })
            .catch((err) => {
                console.error("지원 목록 불러오기 에러 발생:", err);
            });
    },
};

export default apiJobApplicationService;
