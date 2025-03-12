package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private KakaoNotificationService kakaoNotificationService;

    @Autowired
    private UserServiceImpl userService;

    /**
     * 지원 공고 승인 알림을 발송합니다.
     *
     * <p>
     * 사용자의 카카오톡 ID가 등록되어 있으면 카카오 메시지로, 없으면 이메일로 알림을 발송합니다.
     * 이메일 발송 시 마이페이지 링크에 유저 ID가 포함됩니다.
     * </p>
     *
     * @param userId       사용자 ID
     * @param jobPostTitle 공고 제목
     * @param companyName  회사 이름
     * @return 알림 발송 성공 여부
     */
    @Override
    public boolean sendJobApprovalNotification(Long userId, String jobPostTitle, String companyName) {
        try {
            // 사용자 정보 조회
            User user = userService.getUserById(userId.intValue());
            if (user == null) {
                return false;
            }

            // 알림 제목 및 내용 구성
            String title = "[알바잉] 지원하신 공고가 승인되었습니다";
            String content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역이 승인되었습니다.",
                user.getUserName(), companyName, jobPostTitle);

            // 카카오톡 ID가 등록된 경우 카카오 메시지 발송
            if (user.getKakaoId() != null && !user.getKakaoId().isEmpty()) {
                return kakaoNotificationService.sendKakaoMessage(user.getKakaoId(), title, content);
            }
            // 등록되지 않은 경우 이메일 발송 (마이페이지 링크에 유저 ID 포함)
            else {
                return sendEmail(user.getUserEmail(), title, content, Math.toIntExact(user.getUserId()));
            }
        } catch (Exception e) {
            System.err.println("알림 발송 중 오류 발생: " + e.getMessage());
            return false;
        }
    }

    /**
     * 이메일을 발송합니다.
     *
     * @param email   수신자 이메일 주소
     * @param subject 이메일 제목
     * @param content 이메일 내용
     * @param userId  사용자 ID (마이페이지 링크에 사용)
     * @return 이메일 발송 성공 여부
     */
    private boolean sendEmail(String email, String subject, String content, int userId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);

            // 마이페이지 URL에 사용자 ID를 포함
            String mypageUrl = "http://localhost:3000/mypage/" + userId;

            String htmlContent = "<div style='margin:20px; font-family:Arial, sans-serif;'>"
                + "<h2 style='color:#333;'>" + subject + "</h2>"
                + "<p style='font-size:14px; color:#555;'>" + content + "</p>"
                + "<p style='font-size:12px; color:#777;'>알바잉 서비스를 이용해 주셔서 감사합니다.</p>"
                + "<a href='" + mypageUrl + "' style='display:inline-block; padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;'>지원 내역 확인하기</a>"
                + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            return true;
        } catch (MessagingException e) {
            System.err.println("이메일 발송 중 오류 발생: " + e.getMessage());
            return false;
        }
    }
}
