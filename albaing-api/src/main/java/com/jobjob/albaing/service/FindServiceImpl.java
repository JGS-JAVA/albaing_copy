package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FindServiceImpl implements FindService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public User findUserEmail(String userName, String userPhone) {
        return userMapper.findUserEmail(userName, userPhone);
    }

    @Override
    public Company findCompanyEmail(String companyName, String companyPhone) {
        return companyMapper.findCompanyEmail(companyName, companyPhone);
    }
}
