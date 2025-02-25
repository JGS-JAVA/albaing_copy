package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;

import java.util.List;

public interface JobPostService {
    JobPost createJobPost(JobPost jobPost);
    JobPost getJobPost(Long jobPostId);
    List<JobPost> getJobPostList(String jobCategory, String jobType,
                                    String keyword, int page, int size, boolean onlyActive);
    JobPost updateJobPost(JobPost jobPost);
    void updateJobPostStatus(Long jobPostId, boolean status);
    int getTotalCount(String jobCategory, String jobType, String keyword, boolean onlyActive);

    //특정 회사 전체 공고 출력
    List<JobPost> showPosts(long companyId);
}
