package com.jobjob.albaing.service;

import java.util.Map;

public interface LoginService {

    // 유저 로그인
    Map<String, Object> loginUser(String userEmail, String userPassword);

    // 기업 로그인
    Map<String, Object> loginCompany(String companyEmail, String companyPassword);


}
