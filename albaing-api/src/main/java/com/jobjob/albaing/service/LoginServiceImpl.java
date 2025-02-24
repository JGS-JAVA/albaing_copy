package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.CompanyMapper;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public Map<String, Object> loginUser(String userEmail, String userPassword) {
        User loggedInUser = userMapper.loginUser(userEmail, userPassword);
        Map<String, Object> result = new HashMap<String, Object>();

        if (loggedInUser != null) {
            result.put("status", "success");
            result.put("user", loggedInUser);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        return result;
    }

    @Override
    public Map<String, Object> loginCompany(String companyEmail, String companyPassword) {
        User loggedInUser = companyMapper.loginCompany(companyEmail, companyPassword);
        Map<String, Object> result = new HashMap<String, Object>();

        if (loggedInUser != null) {
            result.put("status", "success");
            result.put("user", loggedInUser);
            result.put("redirect", "/");
        } else {
            result.put("status", "fail");
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        return result;
    }
}
