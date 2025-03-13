package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private KakaoNotificationService kakaoNotificationService;

    @Autowired
    private UserServiceImpl userService;

    /**
     * 지원 공고 결과 알림을 발송합니다.
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
        System.out.println("========== 합격 알림 발송 시작 ==========");
        System.out.println("대상 사용자 ID: " + userId);
        System.out.println("공고 제목: " + jobPostTitle);
        System.out.println("회사명: " + companyName);
        boolean result = sendJobStatusNotification(userId, jobPostTitle, companyName, "approved");
        System.out.println("합격 알림 발송 결과: " + (result ? "성공" : "실패"));
        System.out.println("========== 합격 알림 발송 종료 ==========");
        return result;
    }

    @Override
    public boolean sendJobDeniedNotification(Long userId, String jobPostTitle, String companyName) {
        System.out.println("========== 불합격 알림 발송 시작 ==========");
        System.out.println("대상 사용자 ID: " + userId);
        System.out.println("공고 제목: " + jobPostTitle);
        System.out.println("회사명: " + companyName);
        boolean result = sendJobStatusNotification(userId, jobPostTitle, companyName, "denied");
        System.out.println("불합격 알림 발송 결과: " + (result ? "성공" : "실패"));
        System.out.println("========== 불합격 알림 발송 종료 ==========");
        return result;
    }

    private boolean sendJobStatusNotification(Long userId, String jobPostTitle, String companyName, String status) {
        try {
            // 사용자 정보 조회
            System.out.println("[알림 발송] 사용자 정보 조회 시도 (ID: " + userId + ")");
            User user = userService.getUserById(userId.intValue());
            if (user == null) {
                System.out.println("[알림 발송] 오류: 사용자 정보를 찾을 수 없음 (ID: " + userId + ")");
                return false;
            }
            System.out.println("[알림 발송] 사용자 정보 조회 성공: " + user.getUserName() + " (Email: " + user.getUserEmail() + ")");

            // 알림 제목 및 내용 구성
            String title = "";
            String content = "";
            if ("approved".equals(status)) {
                title = "[알바잉] 축하합니다! 지원하신 공고에 합격하셨습니다";
                content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역이 승인되었습니다. 축하합니다!",
                    user.getUserName(), companyName, jobPostTitle);
            } else if ("denied".equals(status)) {
                title = "[알바잉] 지원하신 공고에 대한 결과 안내";
                content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역이 불합격 처리되었습니다. 다음 기회에 다시 도전해보세요!",
                    user.getUserName(), companyName, jobPostTitle);
            } else {
                title = "[알바잉] 지원하신 공고의 상태가 변경되었습니다";
                content = String.format("%s님, %s의 '%s' 공고에 지원하신 내역의 상태가 변경되었습니다.",
                    user.getUserName(), companyName, jobPostTitle);
            }
            System.out.println("[알림 발송] 제목: " + title);
            System.out.println("[알림 발송] 내용: " + content);

            // 카카오톡 ID가 등록된 경우 카카오 메시지 발송
            if (user.getKakaoId() != null && !user.getKakaoId().isEmpty()) {
                System.out.println("[알림 발송] 카카오 ID가 존재하여 카카오톡 메시지 발송 시도 (ID: " + user.getKakaoId() + ")");
                boolean kakaoSent = kakaoNotificationService.sendKakaoMessage(user.getKakaoId(), title, content);

                if (kakaoSent) {
                    System.out.println("[알림 발송] 카카오톡 메시지 발송 성공");
                    return true;
                } else {
                    // 카카오 발송 실패 시 이메일 대체 발송
                    System.out.println("[알림 발송] 카카오톡 메시지 발송 실패, 이메일로 대체 발송합니다.");
                    return sendEmail(user.getUserEmail(), title, content, Math.toIntExact(user.getUserId()), status);
                }
            }
            // 등록되지 않은 경우 이메일 발송 (마이페이지 링크에 유저 ID 포함)
            else {
                System.out.println("[알림 발송] 카카오 ID가 없어 이메일 발송 시도 (Email: " + user.getUserEmail() + ")");
                return sendEmail(user.getUserEmail(), title, content, Math.toIntExact(user.getUserId()), status);
            }
        } catch (Exception e) {
            System.err.println("[알림 발송] 예외 발생: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
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
     * @param status  합격 상태 (approved 또는 denied)
     * @return 이메일 발송 성공 여부
     */
    private boolean sendEmail(String email, String subject, String content, int userId, String status) {
        System.out.println("[이메일 발송] 이메일 발송 시작 (Email: " + email + ")");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            System.out.println("[이메일 발송] MimeMessage 생성 완료");

            helper.setTo(email);
            helper.setSubject(subject);
            System.out.println("[이메일 발송] 수신자 및 제목 설정 완료");

            // 마이페이지 URL에 사용자 ID를 포함
            String mypageUrl = "http://localhost:3000/mypage/" + userId;
            System.out.println("[이메일 발송] 마이페이지 URL: " + mypageUrl);

            // 현재 날짜 포맷팅
            String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));
            System.out.println("[이메일 발송] 현재 날짜: " + currentDate);

            // 상태에 따른 색상과 메시지 설정
            String statusColor = "approved".equals(status) ? "#4CAF50" : "#E74C3C";
            String statusMessage = "approved".equals(status) ? "합격" : "불합격";
            String statusEmoji = "approved".equals(status) ? "🎉" : "📋";
            String statusDescription = "approved".equals(status)
                ? "축하합니다! 상세 정보는 아래 버튼을 클릭하여 확인해주세요."
                : "아쉽지만 다음 기회에 다시 도전해보세요. 다른 채용 공고도 확인해보세요.";
            String buttonText = "approved".equals(status) ? "합격 내역 확인하기" : "다른 공고 보기";
            System.out.println("[이메일 발송] 상태 설정 완료 (상태: " + statusMessage + ")");

            // 공고명과 회사명 추출 (content에서 파싱)
            String jobPostTitle = "";
            String companyName = "";

            try {
                System.out.println("[이메일 발송] 공고명과 회사명 추출 시도");
                // content 형식: "홍길동님, 테스트회사의 '테스트공고' 공고에 지원하신 내역이 승인되었습니다."
                String[] parts = content.split("'");
                if (parts.length >= 2) {
                    jobPostTitle = parts[1]; // '테스트공고' 부분에서 따옴표 사이의 내용 추출
                    System.out.println("[이메일 발송] 추출된 공고명: " + jobPostTitle);
                }

                parts = content.split("님, ");
                if (parts.length >= 2) {
                    String temp = parts[1];
                    companyName = temp.split("의 '")[0]; // "테스트회사의 '" 부분에서 회사명 추출
                    System.out.println("[이메일 발송] 추출된 회사명: " + companyName);
                }
            } catch (Exception e) {
                System.err.println("[이메일 발송] 이메일 내용 파싱 중 오류: " + e.getMessage());
                jobPostTitle = "지원하신 공고";
                companyName = "알바잉 기업";
                System.out.println("[이메일 발송] 기본값 사용: 공고명='" + jobPostTitle + "', 회사명='" + companyName + "'");
            }

            // HTML 템플릿 구성
            System.out.println("[이메일 발송] HTML 템플릿 구성 시작");
            String htmlContent =
                "<!DOCTYPE html>" +
                    "<html lang='ko'>" +
                    "<head>  <meta charset='UTF-8'>  <meta name='viewport' content='width=device-width, initial-scale=1.0'>  <title>" + subject + "</title>  <style>    body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }    .header { background-color: " + statusColor + "; padding: 20px; text-align: center; color: white; }    .header h1 { margin: 0; font-size: 24px; }    .header p { margin: 5px 0 0; opacity: 0.9; font-size: 16px; }    .content { padding: 30px; }    .status-badge { display: inline-block; background-color: " + statusColor + "; color: white; padding: 6px 15px; border-radius: 20px; font-weight: bold; margin-bottom: 15px; }    .info-box { background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin-bottom: 25px; }    .info-box p { margin: 0 0 10px; }    .info-box p:last-child { margin-bottom: 0; }    .info-box strong { color: #444; }    .button { display: inline-block; background-color: " + statusColor + "; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; margin-top: 10px; transition: background-color 0.3s; }    .button:hover { background-color: " + ("approved".equals(status) ? "#388E3C" : "#C0392B") + "; }    .footer { background-color: #f1f1f1; padding: 20px; text-align: center; color: #666; font-size: 12px; }    .emoji { font-size: 32px; margin-bottom: 10px; }  </style></head><body>  <div class='container'>    <div class='header'>      <h1>알바잉</h1>      <p>지원 결과 안내</p>    </div>    <div class='content'>      <div style='text-align: center;'>        <div class='emoji'>" + statusEmoji + "</div>        <div class='status-badge'>" + statusMessage + "</div>      </div>      <p>안녕하세요, " + content.split(",")[0] + "</p>      <p>" + content + "</p>      <p>" + statusDescription + "</p>      <div class='info-box'>        <p><strong>지원 공고명:</strong> " + jobPostTitle + "</p>        <p><strong>회사명:</strong> " + companyName + "</p>        <p><strong>결과 안내일:</strong> " + currentDate + "</p>      </div>      <center><a href='" + mypageUrl + "' class='button'>" + buttonText + "</a></center>    </div>    <div class='footer'>      <p>본 메일은 발신 전용으로 회신되지 않습니다.</p>      <p>© 2024 알바잉. All rights reserved.</p>      <p>우)00000 서울특별시 테스트구 알바잉로 123</p>    </div>  </div></body></html>";
            System.out.println("[이메일 발송] HTML 템플릿 구성 완료 (길이: " + htmlContent.length() + ")");

            helper.setText(htmlContent, true);
            System.out.println("[이메일 발송] 이메일 내용 설정 완료");

            System.out.println("[이메일 발송] 이메일 발송 시도...");
            mailSender.send(message);
            System.out.println("[이메일 발송] 이메일 발송 성공!");
            return true;
        } catch (MessagingException e) {
            System.err.println("[이메일 발송] 이메일 발송 중 MessagingException 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            System.err.println("[이메일 발송] 이메일 발송 중 예외 발생: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}