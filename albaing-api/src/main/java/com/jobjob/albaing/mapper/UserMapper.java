package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface UserMapper {

    // 유저 회원가입 (INSERT)
    void registerUser(User user);

    // 로그인 시 이메일로 userPassword 가져오기
    // 로그인 시 이메일로 사용자 정보 조회 (비밀번호 비교를 위해 사용)
    // Optional<User>는 Java 8에서 도입된 Optional<T> 클래스를 사용하여,
    // User 객체가 null일 수도 있음을 명시적으로 표현하는 방식입니다.

    Optional<User> findByEmail(@Param("userEmail") String userEmail);
}
