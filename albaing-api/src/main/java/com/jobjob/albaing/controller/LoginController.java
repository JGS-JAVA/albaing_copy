package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/account/auth")
public class LoginController {

    @Autowired
    private LoginService loginService;

    // 유저 로그인
    @PostMapping("/login-person")
    public ResponseEntity<Map<String, Object>> loginPerson(@RequestBody User user,
                                                     HttpSession session) {
        Map<String, Object> loginResult = loginService.loginUser(user.getUserEmail(), user.getUserPassword());
        // 만약에 서비스에서 무사히 로그인한 결과를 가져왔다면
        if ("success".equals(loginResult.get("status"))) {
            User loggedInUser = (User) loginResult.get("user");
            session.setAttribute("user", loggedInUser); // 로그인한 유저 정보를 세션에 user 라는 명칭으로  저장
            return ResponseEntity.ok(loginResult);
            // ok = 200 = 리액트에서 전달받은 데이터 값이 존재할 때 뜨는 숫자
        } else { // 무사히 성공하지 못했다면
            return ResponseEntity.status(401).body(loginResult);
        }
    }

    // 기업 로그인
    @PostMapping("/login-company")
    public ResponseEntity<Map<String, Object>> loginCompany(@RequestBody Company company,
                                                     HttpSession session) {
        Map<String, Object> loginResult = loginService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());
        // 만약에 서비스에서 무사히 로그인한 결과를 가져왔다면
        if ("success".equals(loginResult.get("status"))) {
            Company loggedInCompany = (Company) loginResult.get("company");
            session.setAttribute("company", loggedInCompany); // 로그인한 유저 정보를 세션에 user 라는 명칭으로  저장
            return ResponseEntity.ok(loginResult);
            // ok = 200 = 리액트에서 전달받은 데이터 값이 존재할 때 뜨는 숫자
        } else { // 무사히 성공하지 못했다면
            return ResponseEntity.status(401).body(loginResult);
        }
    }

    // 계정 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("status", "logout");
        return ResponseEntity.ok(response);
    }


    // 계정 로그인 상태확인 (세션)
    // 유저의 데이터를 loginUser 에 담고 loginUser 를 session 에 담는다
    // 기업의 데이터를 loginCompany 에 담고 loginCompany 를 session 에 담는다
    // 결국 session 은 하나다.
    @GetMapping("/checkLogin")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        User loginUser = (User) session.getAttribute("user");
        Company loginCompany = (Company) session.getAttribute("company");
        if (loginUser != null) {
            return ResponseEntity.ok(loginUser);
        } else if (loginCompany != null) {
            return ResponseEntity.ok(loginCompany);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 상태가 아닙니다."));
        }

    }


}
