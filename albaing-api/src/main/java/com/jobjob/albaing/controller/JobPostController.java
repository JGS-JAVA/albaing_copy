package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    // 채용공고 생성
    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        JobPost createdPost = jobPostService.createJobPost(jobPost);
        return ResponseEntity.ok(createdPost);
    }

    // 채용공고 상세 조회
    @GetMapping("/{jobpostid}")
    public ResponseEntity<JobPost> getJobPost(@PathVariable Long jobpostid) {
        JobPost jobPost = jobPostService.getJobPost(jobpostid);
        if (jobPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(jobPost);
    }

    // 채용공고 목록 조회 (페이징, 필터링 포함)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getJobPostList(
            @RequestParam(required = false) String jobCategory,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "true") boolean onlyActive
    ) {
        List<JobPost> jobPosts = jobPostService.getJobPostList(jobCategory, jobType, keyword, page, size, onlyActive);
        int totalCount = jobPostService.getTotalCount(jobCategory, jobType, keyword, onlyActive);

        Map<String, Object> response = new HashMap<>();
        response.put("content", jobPosts);
        response.put("totalCount", totalCount);
        response.put("currentPage", page);
        response.put("pageSize", size);

        return ResponseEntity.ok(response);
    }

    // 채용공고 수정
    @PutMapping("/{jobPostId}")
    public ResponseEntity<JobPost> updateJobPost(
            @PathVariable Long jobPostId,
            @RequestBody JobPost jobPost
    ) {
        jobPost.setJobPostId(jobPostId);
        JobPost updatedPost = jobPostService.updateJobPost(jobPost);
        return ResponseEntity.ok(updatedPost);
    }

    // 채용공고 상태 변경 (활성/비활성)
    @PatchMapping("/{jobPostId}/status")
    public ResponseEntity<Void> updateJobPostStatus(
            @PathVariable Long jobPostId,
            @RequestParam boolean status
    ) {
        jobPostService.updateJobPostStatus(jobPostId, status);
        return ResponseEntity.ok().build();
    }
}