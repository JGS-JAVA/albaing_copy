package com.jobjob.albaing.service;

import com.jobjob.albaing.model.vo.VerificationRequest;

public interface VerificationService {
    String randomCode();
    void sendEmail(String email, String code);
    void saveEmailCode(String email, String code);
    boolean verifyCodeWithVO(VerificationRequest request);
    void sendVerificationEmail();
}
