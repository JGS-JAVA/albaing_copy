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
        JobApplication currentApplication = jobApplicationMapper.getJobApplicationById(jobApplicationId);

        jobApplicationMapper.updateJobApplicationStatus(jobApplicationId, approveStatus);

        // 상태 변경 후 알림 발송 (합격 또는 불합격)
        if (currentApplication != null) {
            try {
                // 관련 정보 조회
                JobPost jobPost = jobPostMapper.selectJobPostById(currentApplication.getJobPostId());
                Resume resume = resumeMapper.resumeDetails(currentApplication.getResumeId());

                if (jobPost != null && resume != null) {

                    String companyName = jobPost.getCompanyName();
                    if (companyName == null || companyName.trim().isEmpty()) {
                        // 회사 ID로 회사명 조회 시도
                        try {

                            companyName = "알바잉 기업";
                        } catch (Exception ex) {
                            companyName = "알바잉 기업";
                        }
                    }

                    System.out.println("공고 상태 변경 알림 발송 정보:");
                    System.out.println("- 유저 ID: " + resume.getUserId());
                    System.out.println("- 공고명: " + jobPost.getJobPostTitle());
                    System.out.println("- 회사명: " + companyName);
                    System.out.println("- 상태: " + approveStatus);

                    if ("approved".equals(approveStatus)) {
                        // 합격 알림 발송
                        notificationService.sendJobApprovalNotification(
                            Long.valueOf(resume.getUserId()),
                            jobPost.getJobPostTitle(),
                            companyName
                        );
                    } else if ("denied".equals(approveStatus)) {
                        // 불합격 알림 발송
                        notificationService.sendJobDeniedNotification(
                            Long.valueOf(resume.getUserId()),
                            jobPost.getJobPostTitle(),
                            companyName
                        );
                    }
                } else {
                    System.err.println("공고 또는 이력서 정보를 찾을 수 없음:");
                    System.err.println("- JobPost null: " + (jobPost == null));
                    System.err.println("- Resume null: " + (resume == null));
                }
            } catch (Exception e) {
                System.err.println("공고 상태 변경 알림 발송 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.err.println("지원 정보를 찾을 수 없음 (ID: " + jobApplicationId + ")");
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