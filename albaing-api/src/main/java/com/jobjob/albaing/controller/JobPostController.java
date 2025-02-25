package com.jobjob.albaing.controller;


import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.service.JobPostServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class JobPostController {
    @Autowired
    private JobPostServiceImpl jobPostService;

    //상세 페이지 기업 채용 공고 출력
    @GetMapping("페이지네이션")
    public String showPosts(@PathVariable("companyId") long companyId, Model model) {
        List<JobPost> jobPosts = jobPostService.showPosts(companyId);

        model.addAttribute("jobPosts", jobPosts);

        return "company/companyDetail";
    }

}
