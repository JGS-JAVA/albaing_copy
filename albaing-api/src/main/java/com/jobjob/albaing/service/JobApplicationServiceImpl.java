package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.mapper.JobApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationMapper jobApplicationMapper;

    @Override
    public List<JobApplication> getJobApplications(int resumeId) {
        return jobApplicationMapper.getJobApplications(resumeId);
    }

    @Override
    public List<JobApplication> getJobApplicationsByJobPostId(int jobPostId) {
        return jobApplicationMapper.getJobApplicationsByJobPostId(jobPostId);
    }

    @Override
    public void userApplyForJob(JobApplication jobApplication) {
        jobApplicationMapper.userApplyForJob(jobApplication);
    }

    @Override
    public void updateJobApplicationStatus(int jobApplicationId, String approveStatus) {
        jobApplicationMapper.updateJobApplicationStatus(jobApplicationId, approveStatus);
    }

    @Override
    public int countApplicationsByJobPost(int jobPostId) {
        return jobApplicationMapper.countApplicationsByJobPost(jobPostId);
    }
}
