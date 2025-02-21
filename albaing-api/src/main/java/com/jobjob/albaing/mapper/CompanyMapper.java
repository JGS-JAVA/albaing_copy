package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Company;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;


@Mapper
public interface CompanyMapper {

    // 회사 회원가입 (INSERT)
    void registerCompany(Company company);

    // 회사 로그인
    Company loginCompany(@Param("companyEmail") String companyEmail, @Param("companyPassword")String companyPassword);
}
