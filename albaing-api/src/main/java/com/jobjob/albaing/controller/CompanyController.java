package com.jobjob.albaing.controller;

import org.springframework.ui.Model;
import com.jobjob.albaing.dto.Company;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account/auth")
public class CompanyController {

    //회사 상세 정보 불러오기
    @GetMapping("/company_name/detail/${company_id}")
    public String companyDetail(@PathVariable("companyId") long companyId, Model model) {
        Company company = companyService.companyDetail(companyId);

        model.addAttribute("company", company);

        return "company/companyDetail";
        }

}
