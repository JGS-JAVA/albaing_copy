package com.jobjob.albaing.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/oauth/naver")
public class NaverAPIController {

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-url}")
    private String naverRedirectUrl;

    // state=xyz123  네이버 state 필수 작성 네이버 기준 형식에 맞추기위해서 작성한 값일뿐
    // 의미 없음 의미있게 작성하길 원한다면 xyz=123 대신 UUID 나 OAuthStateUtil.generateState() 와 같은 보안 형식 사용가능
    @GetMapping("/login")
    public ResponseEntity<?> getNaverLoginUrl() {
        String url = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + naverClientId + "&redirect_uri=" + naverRedirectUrl +
                "&state=xyz123";
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam("code") String code,
                                       @RequestParam("state") String state) {
        try {
            String tokenUrl = "https://nid.naver.com/oauth2.0/token";
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

            LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", naverClientId);
            params.add("client_secret", naverClientSecret);
            params.add("code", code);
            params.add("state", state);

            HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            if (response.getBody() == null || !response.getBody().containsKey("access_token")) {
                System.err.println("🚨 네이버 로그인 실패: 액세스 토큰을 받아오지 못했습니다.");

                // RedirectView를 사용하여 에러 페이지로 리다이렉트
                RedirectView errorRedirect = new RedirectView();
                errorRedirect.setUrl("/error?message=네이버 로그인 실패");
                return errorRedirect;
            }

            String accessToken = (String) response.getBody().get("access_token");

            String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

            if (userResponse.getBody() == null || !userResponse.getBody().containsKey("response")) {
                System.err.println("🚨 네이버 사용자 정보를 가져올 수 없습니다.");

                // RedirectView를 사용하여 에러 페이지로 리다이렉트
                RedirectView errorRedirect = new RedirectView();
                errorRedirect.setUrl("/error?message=사용자 정보 없음");
                return errorRedirect;
            }

            Map userInfo = userResponse.getBody();
            System.out.println("🚨 userInfo: " + userInfo);

            Map<String, Object> responseData = (Map<String, Object>) userInfo.get("response");

            String name = (String) responseData.get("name");
            String nickname = (String) responseData.get("nickname");
            String email = (String) responseData.get("email");
            String gender = (String) responseData.get("gender");
            String birthday = (String) responseData.get("birthday");
            String profileImage = (String) responseData.get("profile_image");

            if (name == null || name.isEmpty()) {
                System.err.println("🚨 name 값이 없습니다! 기본값 설정");
                name = "네이버 사용자";
            }
            if (email == null) email = "이메일 없음";

            // 프론트엔드로 바로 리다이렉트할 URL 생성
            StringBuilder frontendRedirectUri = new StringBuilder("http://localhost:3000/register/person");
            frontendRedirectUri.append("?name=").append(URLEncoder.encode(name, StandardCharsets.UTF_8));

            // email과 nickname은 항상 포함
            frontendRedirectUri.append("&email=").append(email);
            if (nickname != null && !nickname.isEmpty()) {
                frontendRedirectUri.append("&nickname=").append(URLEncoder.encode(nickname, StandardCharsets.UTF_8));
            }

            // null이 아닌 경우에만 파라미터 추가
            if (gender != null && !gender.isEmpty()) {
                frontendRedirectUri.append("&gender=").append(gender);
            }
            if (birthday != null && !birthday.isEmpty()) {
                frontendRedirectUri.append("&birthday=").append(birthday);
            }
            if (profileImage != null && !profileImage.isEmpty()) {
                frontendRedirectUri.append("&profileImage=").append(URLEncoder.encode(profileImage, StandardCharsets.UTF_8));
            }

            // RedirectView를 사용하여 바로 리다이렉트
            RedirectView redirectView = new RedirectView();
            redirectView.setUrl(frontendRedirectUri.toString());
            return redirectView;

        } catch (Exception e) {
            System.err.println("🚨 네이버 로그인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();

            // 예외 발생 시 에러 페이지로 리다이렉트
            RedirectView errorRedirect = new RedirectView();
            errorRedirect.setUrl("/error?message=네이버 로그인 오류 발생");
            return errorRedirect;
        }
    }
}