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
        // 중복 지원 체크: 같은 job_post_id와 resume_id 조합이 이미 존재하는지 확인
        int count = jobApplicationMapper.countByJobPostIdAndResumeId(
                jobApplication.getJobPostId(),
                jobApplication.getResumeId());
        if(count > 0) {
            // 중복 지원이면 예외 발생, 컨트롤러의 ExceptionHandler에서 JSON 응답으로 전환됨
            throw new RuntimeException("이미 지원한 공고입니다.");
        }
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

    @Override
    public List<JobApplication> getApplicationsByCompany(int companyId) {
        return jobApplicationMapper.getApplicationsByCompany(companyId);
    }
    
}
