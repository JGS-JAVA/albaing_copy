package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.model.vo.VerificationRequest;
import com.jobjob.albaing.service.LoginService;
import com.jobjob.albaing.service.VerificationService;
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

        if ("success".equals(loginResult.get("status"))) {
            User loggedInUser = (User) loginResult.get("user");
            session.setAttribute("user", loggedInUser);
            return ResponseEntity.ok(loginResult);

        } else {
            return ResponseEntity.status(401).body(loginResult);
        }
    }

    // 기업 로그인
    @PostMapping("/login-company")
    public ResponseEntity<Map<String, Object>> loginCompany(@RequestBody Company company,
                                                     HttpSession session) {
        Map<String, Object> loginResult = loginService.loginCompany(company.getCompanyEmail(), company.getCompanyPassword());

        if ("success".equals(loginResult.get("status"))) {
            Company loggedInCompany = (Company) loginResult.get("company");
            session.setAttribute("company", loggedInCompany);
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

    /**************************** 이메일 인증 ***********************************/
    @Autowired
    private VerificationService verificationService;

    @PostMapping("/sendCode")
    public String sendCode(@RequestBody VerificationRequest vr) {

        System.out.println("=======Request Controller / api / sendCode ========");
        String email = vr.getEmail();
        System.out.println("컨트롤러- 이메일:" + email);

        String code = verificationService.randomCode();
        System.out.println("컨트롤러- 코드:" + code);

        verificationService.saveEmailCode(email, code);
        System.out.println("컨트롤러- 세이브 메서드:" + email + code);

        verificationService.sendEmail(email, code);
        System.out.println("컨트롤러- 이메일 전송 성공:" + code);

        return "이메일을 성공적으로 보냈습니다." + email;
    }

    // 인증번호 일치여부 확인
    @PostMapping("/checkCode")
    public String checkCode(@RequestBody VerificationRequest vr) {
        boolean isValid = verificationService.verifyCodeWithVO(vr);
        System.out.println(isValid);

        if (isValid) {
            return "인증번호 일치";
        } else {
            return "인증번호 불일치";

        }
    }

}
