package com.jobjob.albaing.mapper;


import com.jobjob.albaing.dto.JobApplication;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface JobApplicationMapper {

    List<JobApplication> getJobApplications(int resumeId);

    void userApplyForJob(JobApplication jobApplication);
}
