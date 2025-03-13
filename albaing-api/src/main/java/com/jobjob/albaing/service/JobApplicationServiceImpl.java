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
        // 상태 업데이트 전에 현재 지원 정보 조회
        JobApplication currentApplication = jobApplicationMapper.getJobApplicationById(jobApplicationId);

        // 상태 업데이트
        jobApplicationMapper.updateJobApplicationStatus(jobApplicationId, approveStatus);

        // "approved" 상태로 변경된 경우 알림 발송
        if ("approved".equals(approveStatus) && currentApplication != null) {
            try {
                // 관련 정보 조회
                JobPost jobPost = jobPostMapper.selectJobPostById(currentApplication.getJobPostId());
                Resume resume = resumeMapper.resumeDetails(currentApplication.getResumeId());

                if (jobPost != null && resume != null) {
                    // 알림 발송
                    notificationService.sendJobApprovalNotification(
                        Long.valueOf(resume.getUserId()),
                        jobPost.getJobPostTitle(),
                        jobPost.getCompanyName() // JobPost 클래스에 companyName 필드 추가됨
                    );
                }
            } catch (Exception e) {
                // 알림 발송 실패시 로깅만 하고 진행 (지원 상태 업데이트는 성공해야 함)
                System.err.println("공고 승인 알림 발송 중 오류 발생: " + e.getMessage());
                e.printStackTrace(); // 스택 트레이스 출력으로 디버깅 용이
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