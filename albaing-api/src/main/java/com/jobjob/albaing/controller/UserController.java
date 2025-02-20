package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account/auth")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    // 유저 회원가입
    @PostMapping("/register-person")
    public void registerUser(@RequestBody User user) {
        userService.registerUser(user);
    }




}
