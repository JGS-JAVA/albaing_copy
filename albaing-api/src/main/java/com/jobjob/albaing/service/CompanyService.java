package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;

import java.util.Map;

public interface CompanyService {
    // 기업 회원가입
    void registerCompany(Company company);

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);
}
