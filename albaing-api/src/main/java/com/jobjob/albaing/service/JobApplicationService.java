package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;

import java.util.List;

public interface JobApplicationService {

    List<JobApplication> getJobApplications(int resumeId);

    void userApplyForJob(JobApplication jobApplication);

}
