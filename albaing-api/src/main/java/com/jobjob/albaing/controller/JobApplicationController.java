package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.service.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    @GetMapping("/{jobPostId}")
    public List<JobApplication> getApplicationsByJobPost(@PathVariable int jobPostId) {
        return jobApplicationService.getApplicationsByJobPost(jobPostId);
    }

    @PutMapping("/{applicationId}/status")
    public void updateApplicationStatus(
            @PathVariable int applicationId,
            @RequestParam String status
    ) {
        jobApplicationService.updateApplicationStatus(applicationId, status);
    }
}