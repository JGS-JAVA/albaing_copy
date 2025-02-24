package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.service.CompanyServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account/auth")
public class CompanyController {

    @Autowired
    private CompanyServiceImpl companyService;

    // 기업 회원가입
    @PostMapping("/register-company")
    public void registerCompany(@RequestBody Company company) {
        companyService.registerCompany(company);
    }
}
