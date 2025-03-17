package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 알림 서비스 구현체 - 이메일 전용 버전
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserServiceImpl userService;

    /**
     * 공고 합격 알림을 발송합니다.
     */
    @Override
    public boolean sendJobApprovalNotification(Long userId, String jobPostTitle, String companyName) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) return false;

            String title = "[알바잉] 축하합니다! 지원하신 공고에 합격하셨습니다";
            String content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역이 승인되었습니다. 축하합니다!",
                user.getUserName(), companyName, jobPostTitle);

            return sendEmail(user.getUserEmail(), title, content, Math.toIntExact(user.getUserId()), "approved");
        } catch (Exception e) {
            System.out.println("합격 알림 발송 중 오류 발생: " + e.getMessage());
            return false;
        }
    }

    /**
     * 공고 불합격 알림을 발송합니다.
     */
    @Override
    public boolean sendJobDeniedNotification(Long userId, String jobPostTitle, String companyName) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) return false;

            String title = "[알바잉] 지원하신 공고에 대한 결과 안내";
            String content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역이 불합격 처리되었습니다. 다음 기회에 다시 도전해보세요!",
                user.getUserName(), companyName, jobPostTitle);

            return sendEmail(user.getUserEmail(), title, content, Math.toIntExact(user.getUserId()), "denied");
        } catch (Exception e) {
            System.out.println("불합격 알림 발송 중 오류 발생: " + e.getMessage());
            return false;
        }
    }

    /**
     * 이메일 알림을 발송합니다.
     */
    private boolean sendEmail(String email, String subject, String messageContent, int userId, String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);

            // 이메일 내용 구성
            String mypageUrl = "http://localhost:3000/mypage/" + userId;
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));
            String statusColor = "approved".equals(status) ? "#4CAF50" : "#E74C3C";
            String statusMessage = "approved".equals(status) ? "합격" : "불합격";
            String statusEmoji = "approved".equals(status) ? "🎉" : "📋";
            String statusDescription = "approved".equals(status)
                ? "축하합니다! 상세 정보는 아래 버튼을 클릭하여 확인해주세요."
                : "아쉽지만 다음 기회에 다시 도전해보세요. 다른 채용 공고도 확인해보세요.";
            String buttonText = "approved".equals(status) ? "합격 내역 확인하기" : "다른 공고 보기";

            // 공고명과 회사명 추출
            String jobPostTitle = "지원하신 공고";
            String companyName = "알바잉 기업";
            try {
                // 메시지 내용에서 정보 추출 (형식: "홍길동님, 테스트회사의 '테스트공고' 공고에 지원하신 내역이...")
                String[] parts = messageContent.split("'");
                if (parts.length >= 2) {
                    jobPostTitle = parts[1];
                }
                parts = messageContent.split("님, ");
                if (parts.length >= 2) {
                    String temp = parts[1];
                    companyName = temp.split("의 '")[0];
                }
            } catch (Exception e) {
                System.out.println("메시지 내용에서 정보 추출 실패");
            }

            // HTML 이메일 템플릿 생성
            String htmlContent =
                "<!DOCTYPE html>" +
                    "<html lang='ko'>" +
                    "<head>" +
                    "  <meta charset='UTF-8'>" +
                    "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "  <title>알바잉 지원 결과</title>" +
                    "  <style>" +
                    "    body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }" +
                    "    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }" +
                    "    .header { background-color: " + statusColor + "; padding: 20px; text-align: center; color: white; }" +
                    "    .header h1 { margin: 0; font-size: 24px; }" +
                    "    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 16px; }" +
                    "    .content { padding: 30px; }" +
                    "    .status-badge { display: inline-block; background-color: " + statusColor + "; color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; margin-bottom: 15px; }" +
                    "    .info-box { background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; }" +
                    "    .info-box p { margin: 0 0 10px; }" +
                    "    .info-box p:last-child { margin-bottom: 0; }" +
                    "    .info-box strong { color: #444; }" +
                    "    .button { display: inline-block; background-color: " + statusColor + "; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin-top: 10px; }" +
                    "    .footer { background-color: #f1f1f1; padding: 20px; text-align: center; color: #666; font-size: 12px; }" +
                    "    .emoji { font-size: 32px; margin-bottom: 10px; }" +
                    "  </style>" +
                    "</head>" +
                    "<body>" +
                    "  <div class='container'>" +
                    "    <div class='header'>" +
                    "      <h1>알바잉</h1>" +
                    "      <p>지원 결과 안내</p>" +
                    "    </div>" +
                    "    <div class='content'>" +
                    "      <div style='text-align: center;'>" +
                    "        <div class='emoji'>" + statusEmoji + "</div>" +
                    "        <div class='status-badge'>" + statusMessage + "</div>" +
                    "      </div>" +
                    "      <p>" + messageContent + "</p>" +
                    "      <p>" + statusDescription + "</p>" +
                    "      <div class='info-box'>" +
                    "        <p><strong>지원 공고명:</strong> " + jobPostTitle + "</p>" +
                    "        <p><strong>회사명:</strong> " + companyName + "</p>" +
                    "        <p><strong>결과 안내일:</strong> " + currentDate + "</p>" +
                    "      </div>" +
                    "      <center><a href='" + mypageUrl + "' class='button'>" + buttonText + "</a></center>" +
                    "    </div>" +
                    "    <div class='footer'>" +
                    "      <p>본 메일은 발신 전용으로 회신되지 않습니다.</p>" +
                    "      <p>© " + LocalDateTime.now().getYear() + " 알바잉. All rights reserved.</p>" +
                    "    </div>" +
                    "  </div>" +
                    "</body>" +
                    "</html>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("이메일 알림 발송 성공: " + email);
            return true;
        } catch (MessagingException e) {
            System.out.println("이메일 알림 발송 실패: " + e.getMessage());
            return false;
        }
    }
}