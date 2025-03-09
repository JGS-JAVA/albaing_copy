package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;

public interface FindService {

    User findUserEmail(String userEmail, String userPhone);
}
