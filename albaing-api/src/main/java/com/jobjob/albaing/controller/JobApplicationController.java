package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // 내가 지원한 공고 (resumeId 기준)
    @GetMapping("/resume/{resumeId}")
    public List<JobApplication> getJobApplications(@PathVariable int resumeId) {
        return jobApplicationService.getJobApplications(resumeId);
    }

    // 기업 사용자가 채용공고별 지원자 목록 조회 (jobPostId 기준)
    @GetMapping("/jobPost/{jobPostId}")
    public List<JobApplication> getJobApplicationsByJobPostId(@PathVariable int jobPostId) {
        return jobApplicationService.getJobApplicationsByJobPostId(jobPostId);
    }

    // 사용자 공고 지원
    @PostMapping
    public void userApplyForJob(@RequestBody JobApplication jobApplication) {
        jobApplicationService.userApplyForJob(jobApplication);
    }

    // 지원 상태 변경 (승인/거절)
    @PutMapping("/{jobApplicationId}")
    public void updateJobApplicationStatus(
            @PathVariable int jobApplicationId,
            @RequestBody UpdateStatusRequest updateStatusRequest
    ) {
        jobApplicationService.updateJobApplicationStatus(jobApplicationId, updateStatusRequest.getApproveStatus());
    }

    // (선택사항) 채용공고별 지원자 수 조회
    @GetMapping("/jobPost/{jobPostId}/count")
    public int countApplicationsByJobPost(@PathVariable int jobPostId) {
        return jobApplicationService.countApplicationsByJobPost(jobPostId);
    }

    // 요청 바디를 위한 DTO 클래스 (지원 상태 업데이트)
    public static class UpdateStatusRequest {
        private String approveStatus;

        public String getApproveStatus() {
            return approveStatus;
        }

        public void setApproveStatus(String approveStatus) {
            this.approveStatus = approveStatus;
        }
    }
}
