package com.jobjob.albaing.controller;

import com.jobjob.albaing.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import com.jobjob.albaing.dto.Company;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account/auth")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    //회사 상세 정보 불러오기
    @GetMapping("/company_name/detail/${company_id}")
    public String companyDetail(@PathVariable("companyId") long companyId, Model model) {
        Company company = companyService.companyDetail(companyId);

        model.addAttribute("company", company);

        return "company/companyDetail";
        }

}
