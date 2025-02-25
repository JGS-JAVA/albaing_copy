package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.mapper.CompanyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public void registerCompany(Company company) {
        companyMapper.registerCompany(company);
    }

    // 회사 상세 정보 불러오기
    @Override
    public Company companyDetail(long companyId) {
        return companyMapper.companyDetail(companyId);
    }
}
