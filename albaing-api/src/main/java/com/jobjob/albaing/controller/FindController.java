package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.FindServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class FindController {

    @Autowired
    private FindServiceImpl findService;

    @GetMapping("/find/user/id")
    public User findUserEmail(@RequestParam("userName") String userName, @RequestParam("userPhone") String userPhone) {
        return findService.findUserEmail(userName, userPhone);
    }

    @GetMapping("/find/company/id")
    public Company findCompanyEmail(@RequestParam("companyName") String companyName, @RequestParam("companyPhone") String companyPhone) {
        return findService.findCompanyEmail(companyName, companyPhone);
    }

    // 비밀번호 변경 엔드포인트
    @PostMapping("/update/user/password")
    public String updateUserPassword(@RequestBody User request) {
        findService.resetUserPassword(request.getUserEmail(), request.getUserPhone(), request.getNewPassword());
        return "비밀번호가 성공적으로 변경되었습니다.";
    }

    // 비밀번호 변경 엔드포인트
    @PostMapping("/update/company/password")
    public String updateCompanyPassword(@RequestBody Company request) {
        findService.resetCompanyPassword(request.getCompanyEmail(), request.getCompanyPhone(), request.getNewPassword());
        return "비밀번호가 성공적으로 변경되었습니다.";
    }

}
