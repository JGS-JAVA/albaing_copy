package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    // 유저 로그인
    @Override
    public Map<String, Object> loginUser(String userEmail, String userPassword) {
        Map<String, Object> param = new HashMap<>();
        param.put("userEmail", userEmail);
        param.put("userPassword", userPassword);

        User loggedInUser = userMapper.loginUser(param); // 변경된 부분
        Map<String, Object> result = new HashMap<>();

        if (loggedInUser != null) {
            result.put("status", "success");
            result.put("user", loggedInUser);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return result;
    }

    // 기업 로그인
    @Override
    public Map<String, Object> loginCompany(String companyEmail, String companyPassword) {
        Map<String, Object> param = new HashMap<>();
        param.put("companyEmail", companyEmail);
        param.put("companyPassword", companyPassword);

        Company loggedInCompany = companyMapper.loginCompany(param); // 변경된 부분
        Map<String, Object> result = new HashMap<>();

        if (loggedInCompany != null) {
            result.put("status", "success");
            result.put("company", loggedInCompany);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        return result;
    }


    // 유저 회원가입
    @Override
    public void registerUser(User user) {
        user.setUserEmail(user.getUserEmail());
        user.setUserPassword(user.getUserPassword());
        user.setUserName(user.getUserName());
        user.setUserBirthdate(user.getUserBirthdate());
        user.setUserGender(user.getUserGender());
        user.setUserPhone(user.getUserPhone());
        user.setUserAddress(user.getUserAddress());
        user.setUserProfileImage(user.getUserProfileImage());
        user.setUserCreatedAt(user.getUserCreatedAt());
        user.setUserUpdatedAt(user.getUserUpdatedAt());
        user.setUserTermsAgreement(user.getUserTermsAgreement());
        user.setUserIsAdmin(user.getUserIsAdmin());

        userMapper.registerUser(user);
    }

    // 기업 회원가입
    @Override
    public void registerCompany(Company company) {
        company.setCompanyName(company.getCompanyName());
        company.setCompanyRegistrationNumber(company.getCompanyRegistrationNumber());
        company.setCompanyOwnerName(company.getCompanyOwnerName());
        company.setCompanyOpenDate(company.getCompanyOpenDate());
        company.setCompanyPassword(company.getCompanyPassword());
        company.setCompanyEmail(company.getCompanyEmail());
        company.setCompanyPhone(company.getCompanyPhone());
        company.setCompanyLocalAddress(company.getCompanyLocalAddress());
        company.setCompanyApprovalStatus(company.getCompanyApprovalStatus());
        company.setCompanyCreatedAt(company.getCompanyCreatedAt());
        company.setCompanyUpdatedAt(company.getCompanyUpdatedAt());
        company.setCompanyLogo(company.getCompanyLogo());
        company.setCompanyDescription(company.getCompanyDescription());

        companyMapper.registerCompany(company);
    }
}
