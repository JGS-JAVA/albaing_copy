package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.UserServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/personal/auth")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    // 유저 회원가입
    @PostMapping("/register")
    public void registerUser(@RequestBody User user) {
        userService.registerUser(user);
    }

    // 유저 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User user,
                                                     HttpSession session) {
        Map<String, Object> loginResult = userService.loginUser(user.getUserEmail(), user.getUserPassword());
        // 만약에 서비스에서 무사히 로그인한 결과를 가져왔다면
        if ("success".equals(loginResult.get("status"))) {
            User loggedInuser = (User) loginResult.get("user");
            session.setAttribute("user", loggedInuser); // 로그인한 유저 정보를 세션에 user 라는 명칭으로  저장
            return ResponseEntity.ok(loginResult);
            // ok = 200 = 리액트에서 전달받은 데이터 값이 존재할 때 뜨는 숫자
        } else { // 무사히 성공하지 못했다면
            return ResponseEntity.status(401).body(loginResult);
        }
    }

    // 유저 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "logout");
        return ResponseEntity.ok(response);
    }

    // 유저 로그인 상태확인 (세션)
    @GetMapping("/checkLogin")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        User loginUser = (User) session.getAttribute("user");
        if (loginUser != null) {
            return ResponseEntity.ok(loginUser);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 상태가 아닙니다."));
        }

    }
}
