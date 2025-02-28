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

    //내가 지원한 공고
    @GetMapping("/resume/{resumeId}")
    public List<JobApplication> getJobApplications(@PathVariable int resumeId) {
        return jobApplicationService.getJobApplications(resumeId);
    }

    //사용자 공고 지원
    @PostMapping()
    public void userApplyForJob(@RequestBody JobApplication jobApplication) {
         jobApplicationService.userApplyForJob(jobApplication);
    }



}