package com.jobjob.albaing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KakaoNotificationServiceImpl implements KakaoNotificationService {

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${kakao.admin-key:}")
    private String kakaoAdminKey; // 기본값을 빈 문자열로 설정하여 속성이 없어도 오류 발생 방지

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean sendKakaoMessage(String kakaoId, String title, String content) {
        System.out.println("==================== 카카오톡 알림 발송 시도 ====================");
        System.out.println("카카오 ID: " + kakaoId);
        System.out.println("제목: " + title);
        System.out.println("내용: " + content);

        if (kakaoId == null || kakaoId.trim().isEmpty()) {
            System.out.println("[카카오톡 알림] 실패: 카카오 ID가 없거나 비어있습니다.");
            return false;
        }

        if (kakaoAdminKey == null || kakaoAdminKey.trim().isEmpty()) {
            System.out.println("[카카오톡 알림] 실패: 카카오 어드민 키가 설정되지 않았습니다.");
            System.out.println("config.properties 파일에 kakao.admin-key 설정을 확인해주세요.");
            return false;
        }

        try {
            System.out.println("[카카오톡 알림] 액세스 토큰 요청 시작...");
            String accessToken = getAccessToken(kakaoId);
            if (accessToken == null || accessToken.trim().isEmpty()) {
                System.out.println("[카카오톡 알림] 실패: 액세스 토큰을 가져올 수 없습니다.");
                return false;
            }
            System.out.println("[카카오톡 알림] 액세스 토큰 획득 성공: " +
                (accessToken.startsWith("test_") ? accessToken : accessToken.substring(0, 10) + "..."));

            System.out.println("[카카오톡 알림] 메시지 전송 API 호출 시작...");
            String apiUrl = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Bearer " + accessToken);
            System.out.println("[카카오톡 알림] 요청 헤더 설정 완료");

            System.out.println("[카카오톡 알림] 메시지 템플릿 구성...");
            Map<String, Object> templateObject = new HashMap<>();
            templateObject.put("object_type", "feed");

            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("title", title);
            contentMap.put("description", content);
            contentMap.put("image_url", "https://i.imgur.com/nMpBHOc.png"); // 알바잉 로고 이미지(예시)
            contentMap.put("link", Map.of(
                "web_url", "http://localhost:3000/mypage",
                "mobile_web_url", "http://localhost:3000/mypage"
            ));
            templateObject.put("content", contentMap);

            // 버튼 추가
            Map<String, Object> button1 = new HashMap<>();
            button1.put("title", "지원 내역 보기");
            button1.put("link", Map.of(
                "web_url", "http://localhost:3000/mypage",
                "mobile_web_url", "http://localhost:3000/mypage"
            ));

            Map<String, Object> button2 = new HashMap<>();
            button2.put("title", "더 많은 공고 보기");
            button2.put("link", Map.of(
                "web_url", "http://localhost:3000/jobs",
                "mobile_web_url", "http://localhost:3000/jobs"
            ));

            templateObject.put("buttons", new Object[]{button1, button2});
            System.out.println("[카카오톡 알림] 메시지 템플릿 구성 완료");

            // 요청 파라미터 구성
            System.out.println("[카카오톡 알림] 요청 파라미터 구성...");
            MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
            String templateObjectJson = objectMapper.writeValueAsString(templateObject);
            parameters.add("template_object", templateObjectJson);
            System.out.println("[카카오톡 알림] 템플릿 JSON: " + templateObjectJson);

            // 요청 엔티티 생성
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, headers);
            System.out.println("[카카오톡 알림] 요청 엔티티 생성 완료");

            // API 호출
            System.out.println("[카카오톡 알림] REST API 호출 시작...");
            RestTemplate restTemplate = new RestTemplate();
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, requestEntity, String.class);

                // 응답 코드 확인
                System.out.println("[카카오톡 알림] API 응답 코드: " + response.getStatusCode());
                System.out.println("[카카오톡 알림] API 응답 본문: " + response.getBody());

                if (response.getStatusCode().is2xxSuccessful()) {
                    System.out.println("[카카오톡 알림] 메시지 발송 성공!");
                    return true;
                } else {
                    System.out.println("[카카오톡 알림] 메시지 발송 실패: HTTP 상태 코드 - " + response.getStatusCode());
                    return false;
                }
            } catch (HttpClientErrorException e) {
                System.out.println("[카카오톡 알림] API 호출 오류: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
                return false;
            }
        } catch (Exception e) {
            System.out.println("[카카오톡 알림] 예외 발생: " + e.getClass().getName() + " - " + e.getMessage());
            e.printStackTrace();
            return false;
        } finally {
            System.out.println("==================== 카카오톡 알림 발송 종료 ====================");
        }
    }

    /**
     * 카카오 토큰 가져오기
     * 실제 환경에서는 토큰을 DB에 저장하고 만료 시간을 체크하여 관리해야 합니다.
     */
    private String getAccessToken(String kakaoId) {
        System.out.println("[카카오톡 토큰] 액세스 토큰 요청 시작");
        try {
            // 1. 카카오 어드민 키로 사용자 액세스 토큰 조회 시도
            String adminTokenUrl = "https://kapi.kakao.com/v1/user/access_token";
            HttpHeaders adminHeaders = new HttpHeaders();
            adminHeaders.set("Authorization", "KakaoAK " + kakaoAdminKey);
            adminHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            System.out.println("[카카오톡 토큰] 어드민 키 설정: " + (kakaoAdminKey != null ? kakaoAdminKey.substring(0, 5) + "..." : "null"));

            // 카카오 ID를 숫자로 변환 (카카오 API는 숫자 ID 요구)
            Long targetId;
            try {
                targetId = Long.parseLong(kakaoId);
                System.out.println("[카카오톡 토큰] 카카오 ID 변환 성공: " + targetId);
            } catch (NumberFormatException e) {
                System.out.println("[카카오톡 토큰] 유효하지 않은 카카오 ID 형식: " + kakaoId);
                System.out.println("[카카오톡 토큰] 에러: " + e.getMessage());
                return null;
            }

            // 요청 파라미터
            MultiValueMap<String, String> adminParams = new LinkedMultiValueMap<>();
            adminParams.add("target_id_type", "user_id");
            adminParams.add("target_id", targetId.toString());
            System.out.println("[카카오톡 토큰] 요청 파라미터 설정 완료");

            HttpEntity<MultiValueMap<String, String>> adminRequest =
                new HttpEntity<>(adminParams, adminHeaders);

            RestTemplate restTemplate = new RestTemplate();

            try {
                // 어드민 키로 토큰 정보 조회 시도
                System.out.println("[카카오톡 토큰] 어드민 키로 토큰 요청 시도...");
                ResponseEntity<Map> adminResponse = restTemplate.exchange(
                    adminTokenUrl,
                    HttpMethod.POST,
                    adminRequest,
                    Map.class
                );

                System.out.println("[카카오톡 토큰] 어드민 토큰 응답: " + adminResponse.getStatusCode());
                System.out.println("[카카오톡 토큰] 어드민 토큰 응답 본문: " + adminResponse.getBody());

                if (adminResponse.getStatusCode().is2xxSuccessful() &&
                    adminResponse.getBody() != null &&
                    adminResponse.getBody().containsKey("access_token")) {
                    String token = adminResponse.getBody().get("access_token").toString();
                    System.out.println("[카카오톡 토큰] 토큰 획득 성공: " + token.substring(0, 10) + "...");
                    return token;
                } else {
                    System.out.println("[카카오톡 토큰] 토큰 정보가 응답에 포함되지 않음");
                }
            } catch (HttpClientErrorException e) {
                System.out.println("[카카오톡 토큰] 어드민 키로 액세스 토큰 조회 실패: " + e.getStatusCode());
                System.out.println("[카카오톡 토큰] 오류 응답: " + e.getResponseBodyAsString());
                // 실패 시 다음 방법으로 진행
            }

            // 2. 앱 키와 리다이렉트 URI로 토큰 발급 시도 (개발 테스트용)
            // 참고: 실제 환경에서는 사용자의 동의 과정이 필요하므로 이 방법은 제한적임
            System.out.println("[카카오톡 토큰] 카카오 액세스 토큰 발급에 실패하여 테스트 토큰을 사용합니다.");
            String testToken = "test_access_token_for_" + kakaoId;
            System.out.println("[카카오톡 토큰] 테스트 토큰 생성: " + testToken);
            return testToken; // 테스트용 임시 토큰

        } catch (Exception e) {
            System.out.println("[카카오톡 토큰] 카카오 액세스 토큰 획득 중 예외 발생: " + e.getClass().getName());
            System.out.println("[카카오톡 토큰] 에러 메시지: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}