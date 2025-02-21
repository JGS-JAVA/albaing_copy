package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.JobPost;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface JobPostMapper {
    void insertJobPost(JobPost jobPost);
    JobPost selectJobPostById(Long jobPostId);
    List<JobPost> selectJobPostList(Map<String, Object> params);
    void updateJobPost(JobPost jobPost);
    void updateJobPostStatus(Long jobPostId, boolean status);
    int countJobPost(Map<String, Object> params);
}
