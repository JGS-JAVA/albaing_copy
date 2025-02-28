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

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
@RequestMapping("/oauth/kakao")
public class KakaoAPIController {

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @GetMapping("/login")
    public ResponseEntity<?> getKakaoLoginUrl() {
        String url = "https://kauth.kakao.com/oauth/authorize?response_type=code" +
                "&client_id=" + kakaoClientId + "&redirect_uri=" + redirectUri;
        return ResponseEntity.ok(url);
    }

    @GetMapping("/callback")
    public String handleCallback(@RequestParam String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        if (kakaoClientSecret != null) {
            params.add("client_secret", kakaoClientSecret);
        }

        HttpEntity<LinkedMultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
        String accessToken = (String) response.getBody().get("access_token");

        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

        Map userInfo = userResponse.getBody();
        System.out.println("카카오톡에서 인증받아 가져온 사용자 정보 보기 : " + userInfo);

        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        String nickname = (String) properties.get("nickname");
        String encodedNickname = URLEncoder.encode(nickname, StandardCharsets.UTF_8);
        String profileImg = (String) properties.get("profile_image");

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        String email = (String) kakaoAccount.get("email");
        String gender = (String) kakaoAccount.get("gender");
        String birthday = (String) kakaoAccount.get("birthday");

        return "redirect:/register/person?nickname=" + encodedNickname + "&email=" + email +"&gender=" +gender +"&birthday=" +birthday + "&profileImg=" + profileImg;
    }
}


