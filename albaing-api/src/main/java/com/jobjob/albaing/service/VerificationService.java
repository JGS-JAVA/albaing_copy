package com.jobjob.albaing.service;

import com.jobjob.albaing.model.vo.VerificationRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class VerificationService {

    @Autowired
    private JavaMailSender mailSender;
    private Map<String, String> verificationCodes = new HashMap<String, String>();

    public String randomCode() {
        Random rand = new Random();
        int randomNum = 100000 + rand.nextInt(900000);
        return String.valueOf(randomNum);

    }

    public void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("인증번호 보냅니다");
        message.setText("인증번호입니다" + code);
        mailSender.send(message);
        System.out.println("이메일 보내기 성공" + email);

    }

    public void saveEmailCode(String email, String code) {
        System.out.println("=====Service- Save Email Code=========");
        verificationCodes.put(email.toLowerCase(), code);
        System.out.println("Save Email Code: " + email.toLowerCase() + code);
    }

    public boolean verifyCodeWithVO(VerificationRequest request) {
        String email = request.getEmail().toLowerCase();
        System.out.println(" Email : " + email);

        String inputCode = request.getCode();
        System.out.println(" inputCode : " + inputCode);

        String saveCode = verificationCodes.get(email);
        System.out.println(" saveCode : " + saveCode);

        return inputCode.equals(saveCode);
    }
}
