package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;

import java.util.Map;

public interface AuthService {

    // 유저 로그인
    Map<String, Object> loginUser(String userEmail, String userPassword);

    // 기업 로그인
    Map<String, Object> loginCompany(String companyEmail, String companyPassword);

    // 유저 회원가입
    void registerUser(User user);

    // 기업 회원가입
    void registerCompany(Company company);

}
