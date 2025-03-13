package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.JobApplication;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface JobApplicationMapper {
    List<JobApplication> getJobApplications(@Param("resumeId") int resumeId);

    List<JobApplication> getJobApplicationsByJobPostId(@Param("jobPostId") int jobPostId);

    // ID로 특정 지원 내역 조회 메서드 추가
    JobApplication getJobApplicationById(@Param("jobApplicationId") int jobApplicationId);

    void userApplyForJob(JobApplication jobApplication);

    void updateJobApplicationStatus(
        @Param("jobApplicationId") int jobApplicationId,
        @Param("approveStatus") String approveStatus
    );

    int countApplicationsByJobPost(@Param("jobPostId") int jobPostId);

    int countByJobPostIdAndResumeId(@Param("jobPostId") int jobPostId, @Param("resumeId") int resumeId);

    List<JobApplication> getApplicationsByCompany(@Param("companyId") int companyId);
}