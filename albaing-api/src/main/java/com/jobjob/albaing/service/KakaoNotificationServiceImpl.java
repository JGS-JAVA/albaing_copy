package com.jobjob.albaing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class KakaoNotificationServiceImpl implements KakaoNotificationService {

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${kakao.admin-key:}")
    private String kakaoAdminKey; // 기본값을 빈 문자열로 설정하여 속성이 없어도 오류 발생 방지

    @Override
    public boolean sendKakaoMessage(String kakaoId, String title, String content) {
        // kakaoId나 kakaoAdminKey가 null이거나 비어있으면 바로 false 반환
        if (kakaoId == null || kakaoId.trim().isEmpty() ||
            kakaoAdminKey == null || kakaoAdminKey.trim().isEmpty()) {
            System.err.println("카카오 메시지 발송 실패: kakaoId 또는 kakaoAdminKey가 설정되지 않았습니다.");
            return false;
        }

        try {
            String apiUrl = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String accessToken = getAccessTokenByAdminKey(kakaoId);
            if (accessToken == null || accessToken.trim().isEmpty()) {
                return false;
            }

            headers.set("Authorization", "Bearer " + accessToken);

            // 메시지 템플릿 구성
            Map<String, Object> templateObject = new HashMap<>();
            templateObject.put("object_type", "text");
            templateObject.put("text", content);
            templateObject.put("link", Map.of(
                "web_url", "http://localhost:3000/mypage",
                "mobile_web_url", "http://localhost:3000/mypage"
            ));
            templateObject.put("button_title", "지원 내역 보기");

            // 요청 파라미터 구성
            MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
            parameters.add("template_object", templateObject.toString());

            // 요청 엔티티 생성
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, headers);

            // API 호출
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForObject(apiUrl, requestEntity, String.class);

            return true;
        } catch (Exception e) {
            System.err.println("카카오 메시지 발송 중 오류 발생: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 출력
            return false;
        }
    }

    /**
     * 카카오 어드민 키를 이용해 특정 사용자의 액세스 토큰 얻기
     * 실제로는 액세스 토큰을 DB에 저장하고 관리하는 것이 좋습니다.
     */
    private String getAccessTokenByAdminKey(String kakaoId) {
        try {
            String apiUrl = "https://kapi.kakao.com/v1/user/access_token_info";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "KakaoAK " + kakaoAdminKey);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            // 여기서는 간단히 처리하지만, 실제로는 액세스 토큰 발급 API를 호출해야 합니다
            // 테스트 목적으로 임시 값 반환
            return "test_access_token_for_" + kakaoId;
        } catch (Exception e) {
            System.err.println("카카오 액세스 토큰 획득 중 오류 발생: " + e.getMessage());
            return null;
        }
    }
}