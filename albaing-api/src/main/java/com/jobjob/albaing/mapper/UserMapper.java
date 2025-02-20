package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface UserMapper {

    // 유저 회원가입 (INSERT)
    void registerUser(User user);

    // 유저 로그인
    User loginUser(@Param("userEmail") String userEmail, @Param("userPassword")String userPassword);


}
