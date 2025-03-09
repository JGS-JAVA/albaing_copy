package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.FindServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class FindController {

    @Autowired
    private FindServiceImpl findService;

    @GetMapping("/find/id")
    public User findUserEmail(@RequestParam("userName") String userName, @RequestParam("userPhone") String userPhone) {
        return findService.findUserEmail(userName, userPhone);
    }

}
