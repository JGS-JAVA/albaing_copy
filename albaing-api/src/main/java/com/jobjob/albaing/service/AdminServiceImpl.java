package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.AdminMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public List<User> adminSearchUsers(String userName, String userEmail, String userPhone) {
        List<User> users = new ArrayList<User>();
        users = adminMapper.adminSearchUsers(userName, userEmail, userPhone);
        return users;
    }

    @Override
    public List<Resume> adminSearchResumes(String resumeTitle, String resumeJobCategory, String resumeJobType) {
        List<Resume> resumes = new ArrayList<>();
        resumes = adminMapper.adminSearchResumes(resumeTitle, resumeJobCategory, resumeJobType);
        return resumes;
    }

    @Override
    public List<JobApplication> adminSearchJobApplications(String userName, String companyName, String jobPostTitle) {
        List<JobApplication> adminSearchJobApplications = new ArrayList<>();
        return List.of();
    }

    @Override
    public List<Company> adminSearchCompanies(String companyName, String companyOwnerName, String companyPhone, String companyRegistrationNumber) {
        return List.of();
    }

    @Override
    public List<JobPost> adminSearchJobPosts(String companyName, String jobPostTitle, String jobPostStatus) {
        return List.of();
    }
}
