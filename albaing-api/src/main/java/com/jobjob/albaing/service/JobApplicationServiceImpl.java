package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobApplication;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.mapper.JobApplicationMapper;
import com.jobjob.albaing.mapper.JobPostMapper;
import com.jobjob.albaing.mapper.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {

    @Autowired
    private JobApplicationMapper jobApplicationMapper;

    @Autowired
    private JobPostMapper jobPostMapper;

    @Autowired
    private ResumeMapper resumeMapper;

    @Autowired
    private NotificationService notificationService;

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
        int count = jobApplicationMapper.countByJobPostIdAndResumeId(
            jobApplication.getJobPostId(),
            jobApplication.getResumeId());
        if(count > 0) {
            throw new RuntimeException("이미 지원한 공고입니다.");
        }
        jobApplicationMapper.userApplyForJob(jobApplication);
    }

    @Override
    public void updateJobApplicationStatus(int jobApplicationId, String approveStatus) {
        JobApplication currentApplication = jobApplicationMapper.getJobApplicationById(jobApplicationId);

        jobApplicationMapper.updateJobApplicationStatus(jobApplicationId, approveStatus);

        if (currentApplication != null) {
            try {
                JobPost jobPost = jobPostMapper.selectJobPostById(currentApplication.getJobPostId());
                Resume resume = resumeMapper.resumeDetails(currentApplication.getResumeId());

                if (jobPost != null && resume != null) {
                    String companyName = jobPost.getCompanyName();
                    if (companyName == null || companyName.trim().isEmpty()) {
                        companyName = "알바잉 기업";
                    }

                    if ("approved".equals(approveStatus)) {
                        notificationService.sendJobApprovalNotification(
                            Long.valueOf(resume.getUserId()),
                            jobPost.getJobPostTitle(),
                            companyName
                        );
                    }
                    else if ("denied".equals(approveStatus)) {
                        notificationService.sendJobDeniedNotification(
                            Long.valueOf(resume.getUserId()),
                            jobPost.getJobPostTitle(),
                            companyName
                        );
                    }
                }
            } catch (Exception e) {
                System.err.println("공고 상태 변경 알림 발송 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
            }
        }
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