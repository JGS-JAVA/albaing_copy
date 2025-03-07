package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.AdminServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminServiceImpl adminService;

    // 유저 검색
    @GetMapping("/users")
    public List<User> adminSearchUsers(@PathVariable String userName,
                                       @PathVariable String userEmail,
                                       @PathVariable String userPhone,
                                       @PathVariable String sortOrderBy,
                                       @PathVariable Boolean isDESC) {

        return adminService.adminSearchUsers(userName, userEmail, userPhone, sortOrderBy, isDESC);
    }

    // 이력서 검색
    @GetMapping("/resumes")
    public List<Resume> adminSearchResumes(@PathVariable String resumeTitle,
                                           @PathVariable String resumeCategory,
                                           @PathVariable String resumeJobType,
                                           @PathVariable String sortOrderBy,
                                           @PathVariable Boolean isDESC) {

        return adminService.adminSearchResumes(resumeTitle, resumeCategory, resumeJobType, sortOrderBy, isDESC);
    }

    // 지원이력 검색
    @GetMapping("/job-applications")
    public List<JobApplication> adminSearchJobApplications(@PathVariable String userName,
                                                           @PathVariable String companyName,
                                                           @PathVariable String jobPostTitle,
                                                           @PathVariable String sortOrderBy,
                                                           @PathVariable Boolean isDESC) {

        return adminService.adminSearchJobApplications(userName, companyName, jobPostTitle, sortOrderBy, isDESC);
    }

    // 법인 검색
    @GetMapping("/companies")
    public List<Company> adminSearchCompanies(@PathVariable String companyName,
                                              @PathVariable String companyOwnerName,
                                              @PathVariable String companyPhone,
                                              @PathVariable String companyRegistrationNumber,
                                              @PathVariable String sortOrderBy,
                                              @PathVariable Boolean isDESC) {

        return adminService.adminSearchCompanies(companyName, companyOwnerName, companyPhone, companyRegistrationNumber, sortOrderBy, isDESC);
    }

    // 구인공고 검색
    @GetMapping("/job-posts")
    public List<JobPost> adminSearchJobPosts(@PathVariable String companyName,
                                             @PathVariable String jobPostTitle,
                                             @PathVariable String jobPostStatus,
                                             @PathVariable String sortOrderBy,
                                             @PathVariable Boolean isDESC) {
        return adminService.adminSearchJobPosts(companyName, jobPostTitle, jobPostStatus, sortOrderBy, isDESC);
    }

    // 개인 정보 상세 조회
    @GetMaaping("/users/{userId}")
    public User adminUserDetail(@PathVariable String userId) {
        return adminService.adminUserDetail(userId);
    }


    public void adminUserDelete(@PathVariable String userId) {
        adminService.adminUserDelete(userId);
    }

    public Resume adminResumeDetail(@PathVariable String resumeId) {
        return adminService.adminResumeDetail(resumeId);
    }

    public void adminResumeDelete(@PathVariable String resumeId) {
        adminService.adminResumeDelete(resumeId);
    }

    public Company adminCompanyDetail(@PathVariable String companyId) {
        return adminService.adminCompanyDetail(companyId);
    }

    public void adminCompanyDelete(@PathVariable String companyId) {
        adminService.adminCompanyDelete(companyId);
    }

    public JobPost adminJobPostDetail(@PathVariable String jobPostId) {
        return adminService.adminJobPostDetail(jobPostId);
    }

    public void adminJobPostDelete(@PathVariable String jobPostId) {
        adminService.adminJobPostDelete(jobPostId);
    }

    public void adminJobPostStatusChange(@PathVariable String companyId) {
        adminService.adminJobPostStatusChange(companyId);
    }

}
