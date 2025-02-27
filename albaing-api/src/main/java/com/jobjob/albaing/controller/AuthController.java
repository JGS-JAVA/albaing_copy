package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.model.vo.VerificationRequest;
import com.jobjob.albaing.service.AuthServiceImpl;
import com.jobjob.albaing.service.VerificationServiceImpl;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/account/auth")
public class AuthController {

    @Autowired
    private AuthServiceImpl authService;

    // 유저 로그인
    @PostMapping("/login-person")
    public ResponseEntity<Map<String, Object>> loginPerson(@RequestBody User user,
                                                     HttpSession session) {
        Map<String, Object> loginResult = authService.loginUser(user.getUserEmail(), user.getUserPassword());

        if ("success".equals(loginResult.get("status"))) {
            User loggedInUser = (User) loginResult.get("user");
            session.setAttribute("userSession", loggedInUser);
            return ResponseEntity.ok(loginResult);

        } else {
            return ResponseEntity.status(401).body(loginResult);
        }
    }

    // 기업 로그인
    @PostMapping("/login-company")
    public ResponseEntity<Map<String, Object>> loginCompany(@RequestBody Company company,
                                                     HttpSession session) {
        Map<String, Object> loginResult = authService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());

        if ("success".equals(loginResult.get("status"))) {
            Company loggedInCompany = (Company) loginResult.get("company");
            session.setAttribute("companySession", loggedInCompany);
            return ResponseEntity.ok(loginResult);

        } else {
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
    @GetMapping("/checkLogin")
    public ResponseEntity<?> checkLogin(HttpSession session) {
        User loginUser = (User) session.getAttribute("userSession");
        Company loginCompany = (Company) session.getAttribute("companySession");
        if (loginUser != null) {
            return ResponseEntity.ok(loginUser);
        } else if (loginCompany != null) {
            return ResponseEntity.ok(loginCompany);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "로그인 상태가 아닙니다."));
        }
    }

    // 유저 회원가입
    @PostMapping("/register-person")
    public void registerUser(@RequestBody User user) {
        authService.registerUser(user);
    }


    // 기업 회원가입
    @PostMapping("/register-company")
    public void registerCompany(@RequestBody Company company) {
        authService.registerCompany(company);
    }


    /**************************** 이메일 인증 ***********************************/
    @Autowired
    private VerificationServiceImpl verificationServiceImpl;

    @PostMapping("/sendCode")
    public String sendCode(@RequestBody VerificationRequest vr) {

        System.out.println("=======Request Controller / api / sendCode ========");
        String email = vr.getEmail();
        System.out.println("컨트롤러- 이메일:" + email);

        String code = verificationServiceImpl.randomCode();
        System.out.println("컨트롤러- 코드:" + code);

        verificationServiceImpl.saveEmailCode(email, code);
        System.out.println("컨트롤러- 세이브 메서드:" + email + code);

        verificationServiceImpl.sendEmail(email, code);
        System.out.println("컨트롤러- 이메일 전송 성공:" + code);

        return "이메일을 성공적으로 보냈습니다." + email;
    }

    // 인증번호 일치여부 확인
    @PostMapping("/checkCode")
    public String checkCode(@RequestBody VerificationRequest vr) {
        boolean isValid = verificationServiceImpl.verifyCodeWithVO(vr);
        System.out.println(isValid);

        if (isValid) {
            return "인증번호 일치";
        } else {
            return "인증번호 불일치";

        }
    }

}
