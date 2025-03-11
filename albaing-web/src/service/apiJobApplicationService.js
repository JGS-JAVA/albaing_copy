// // (새로 추가) 이력서 기준 지원 내역 조회
// @GetMapping("/resume/{resumeId}")
// public List<JobApplication> getJobApplicationsByResume(
//     @PathVariable("resumeId") int resumeId
// ) {
//     return jobApplicationService.getJobApplications(resumeId);
// }

import axios from "axios";

const API_APPLICATION_URL = "http://localhost:8080/api/applications";

const apiJobApplicationService  = {

    getJobApplicationsByResume: function(resumeId, resumeData){
        axios
            .get(`${API_APPLICATION_URL}/resume/${resumeId}`)
            .then(
                (res) =>{
                    resumeData(res.data);
                    console.log("지원 목록 가져오기 성공", res.data);
                }
            )
            .catch(
                (err)=>{
                    console.error("지원목록 불러오기 에러발생 : ",err);
                }
            )
    },



};
export default apiJobApplicationService;