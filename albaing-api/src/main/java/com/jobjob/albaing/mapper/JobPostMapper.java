package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.JobPost;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface JobPostMapper {
    void insertJobPost(JobPost jobPost);
    JobPost selectJobPostById(long jobPostId);
    List<JobPost> selectJobPostList(Map<String, Object> params);
    void updateJobPost(JobPost jobPost);
    void updateJobPostStatus(@Param("jobPostId") long jobPostId,
                             @Param("status") boolean status);
    int countJobPost(Map<String, Object> params);

    //특정 회사 전체 공고 출력
    List<JobPost> showPosts(long companyId);

    List<JobPost> getJobPostsByCompanyId(long companyId);
}
