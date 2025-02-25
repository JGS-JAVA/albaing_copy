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
public class VerificationServiceImpl implements VerificationService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> verificationCodes = new HashMap<>();

    @Override
    public String randomCode() {
        Random rand = new Random();
        int randomNum = 100000 + rand.nextInt(900000);
        return String.valueOf(randomNum);
    }

    @Override
    public void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("인증번호 보냅니다");
        message.setText("인증번호: " + code);
        mailSender.send(message);
        System.out.println("이메일 보내기 성공: " + email);
    }

    @Override
    public void saveEmailCode(String email, String code) {
        System.out.println("===== Service - Save Email Code =====");
        verificationCodes.put(email.toLowerCase(), code);
        System.out.println("Save Email Code: " + email.toLowerCase() + " -> " + code);
    }

    @Override
    public boolean verifyCodeWithVO(VerificationRequest request) {
        String email = request.getEmail().toLowerCase();
        String inputCode = request.getCode();
        String savedCode = verificationCodes.get(email);

        System.out.println(" Email: " + email);
        System.out.println(" Input Code: " + inputCode);
        System.out.println(" Saved Code: " + savedCode);

        return inputCode != null && inputCode.equals(savedCode);
    }

    @Override
    public void sendVerificationEmail() {
        String email = "wlrncom@gmail.com";
        String code = randomCode();

        sendEmail(email, code);
        saveEmailCode(email, code);
    }
}
