package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;

import java.util.Map;

public interface UserService {
    // 유저 회원가입
    void registerUser(User user);
    // 유저 로그인
    Map<String, Object> loginUser(String userEmail, String userPassword);
}
