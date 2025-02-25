package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.mapper.JobPostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobPostServiceImpl implements JobPostService {

    @Autowired
    private JobPostMapper jobPostMapper;

    @Override
    public JobPost createJobPost(JobPost jobPost) {
        jobPost.setJobPostStatus(true);
        jobPostMapper.insertJobPost(jobPost);
        return jobPost;
    }

    @Override
    public JobPost getJobPost(int jobPostId) {
        return jobPostMapper.selectJobPostById(jobPostId);
    }

    @Override
    public List<JobPost> getJobPostList(String jobCategory, String jobType,
                                        String keyword, int page, int size, boolean onlyActive) {
        Map<String, Object> params = new HashMap<>();
        params.put("jobCategory", jobCategory);
        params.put("jobType", jobType);
        params.put("keyword", keyword);
        params.put("offset", (page - 1) * size);
        params.put("limit", size);
        params.put("onlyActive", onlyActive);

        return jobPostMapper.selectJobPostList(params);
    }

    @Override
    public JobPost updateJobPost(JobPost jobPost) {
        jobPostMapper.updateJobPost(jobPost);
        return jobPost;
    }

    @Override
    public void updateJobPostStatus(int jobPostId, boolean status) {
        jobPostMapper.updateJobPostStatus(jobPostId, status);
    }

    @Override
    public int getTotalCount(String jobCategory, String jobType, String keyword, boolean onlyActive) {
        Map<String, Object> params = new HashMap<>();
        params.put("jobCategory", jobCategory);
        params.put("jobType", jobType);
        params.put("keyword", keyword);
        params.put("onlyActive", onlyActive);

        return jobPostMapper.countJobPost(params);
    }
    //특정 회사 전체 공고 출력
    @Override
    public List<JobPost> showPosts(long companyId) {
        return jobPostMapper.showPosts(companyId);
    }
}
