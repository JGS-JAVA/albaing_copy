package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 유저 로그인
    @Override
    public Map<String, Object> loginUser(String userEmail, String userPassword) {
        User loggedInUser = userMapper.loginUser(userEmail, userPassword);
        Map<String, Object> result = new HashMap<>();

        if (loggedInUser != null && passwordEncoder.matches(userPassword, loggedInUser.getUserPassword())) {
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
        Company loggedInCompany = companyMapper.loginCompany(companyEmail, companyPassword);
        Map<String, Object> result = new HashMap<>();

        if (loggedInCompany != null && passwordEncoder.matches(companyPassword, loggedInCompany.getCompanyPassword())) {
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
        user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        userMapper.registerUser(user);
    }

    // 기업 회원가입
    @Override
    public void registerCompany(Company company) {
        company.setCompanyPassword(passwordEncoder.encode(company.getCompanyPassword()));
        companyMapper.registerCompany(company);
    }
}
