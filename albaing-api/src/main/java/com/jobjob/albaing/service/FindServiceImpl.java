package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FindServiceImpl implements FindService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public User findUserEmail(String userEmail, String userPhone) {
        return userMapper.findUserEmail(userEmail, userPhone);
    }
}
