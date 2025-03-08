package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // 회사 기준 지원자 목록 조회 엔드포인트
    @GetMapping("/company/{companyId}")
    public List<JobApplication> getApplicationsByCompany(@PathVariable("companyId") int companyId) {
        return jobApplicationService.getApplicationsByCompany(companyId);
    }

    @PutMapping("/{jobApplicationId}")
    public void updateJobApplicationStatus(
            @PathVariable("jobApplicationId") int jobApplicationId,
            @RequestBody UpdateStatusRequest request
    ) {
        jobApplicationService.updateJobApplicationStatus(
                jobApplicationId,
                request.getApproveStatus()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return errorResponse;
    }

    // 상태 업데이트 요청용 내부 DTO (별도의 DTO를 만들지 않고 컨트롤러 내부 클래스로 처리)
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
