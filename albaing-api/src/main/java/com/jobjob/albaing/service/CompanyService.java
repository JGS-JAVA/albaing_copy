package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;


public interface CompanyService {

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);

    void registerCompany(Company company);
}
