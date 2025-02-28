package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;

import java.util.Map;

public interface UserService {

    // 사용자 정보 조회
    User getUserById(int userId);

    // 사용자 정보 수정
    void updateUser(int userId, String userEmail, String userAddress, String userProfileImage);

}
