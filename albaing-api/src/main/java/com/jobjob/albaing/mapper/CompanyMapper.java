package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Company;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface CompanyMapper {

    // 회사 회원가입 (INSERT)
    void registerCompany(Company company);

    // 회사 정보 조회 (로그인 시 이메일로 검색)
    Optional<Company> findByEmail(@Param("companyEmail") String companyEmail);
}
