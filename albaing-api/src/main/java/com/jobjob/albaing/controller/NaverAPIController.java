package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.AuthServiceImpl;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/oauth/naver")
public class NaverAPIController {

    @Autowired
    private AuthServiceImpl authService;

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.redirect-url}")
    private String redirectUrl;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @GetMapping("/login")
    public RedirectView getNaverLoginUrl() {
        String naverAuthUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + naverClientId +
                "&redirect_uri=" + redirectUrl +
                "&state=xyz123";

        return new RedirectView(naverAuthUrl);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam("code") String code,
                                       @RequestParam("state") String state) {
        RestTemplate restTemplate = new RestTemplate();

        // 1️⃣ 네이버 토큰 요청
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";

        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverClientId);
        params.add("client_secret", naverClientSecret);
        params.add("code", code);
        params.add("state", state);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<LinkedMultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        Map<String, Object> tokenResponse = restTemplate.postForObject(tokenUrl, tokenRequest, Map.class);

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return new RedirectView("http://localhost:3000/error?message=Failed to get access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2️⃣ 네이버 사용자 정보 요청
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

        if (userResponse.getBody() == null || !userResponse.getBody().containsKey("response")) {
            return new RedirectView("http://localhost:3000/error?message=Failed to fetch user info");
        }

        // 3️⃣ 사용자 정보 파싱
        Map<String, Object> userInfo = (Map<String, Object>) userResponse.getBody().get("response");
        String naverId = userInfo.get("id").toString();
        String name = (String) userInfo.get("name");
        String nickname = (String) userInfo.getOrDefault("nickname", "");
        String email = (String) userInfo.getOrDefault("email", "");
        String gender = (String) userInfo.getOrDefault("gender", "");
        String birthday = (String) userInfo.getOrDefault("birthday", "");
        String profileImage = (String) userInfo.getOrDefault("profile_image", "");

        // 4️⃣ DB에서 가입 여부 확인
        if (authService.isUserExist(email)) {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                HttpSession session = request.getSession();
                User loggedInUser = authService.getUserByEmail(email);
                session.setAttribute("userSession", loggedInUser);
                return new RedirectView("http://localhost:3000/");
            }
        }

        // ✅ `naverId` 포함하여 프론트로 전달
        String frontendRedirectUri = "http://localhost:3000/register/person"
                + "?name=" + URLEncoder.encode(name, StandardCharsets.UTF_8)
                + "&email=" + email
                + "&naverId=" + naverId;

        if (!nickname.isEmpty()) {
            frontendRedirectUri += "&nickname=" + URLEncoder.encode(nickname, StandardCharsets.UTF_8);
        }
        if (!gender.isEmpty()) {
            frontendRedirectUri += "&gender=" + gender;
        }
        if (!birthday.isEmpty()) {
            frontendRedirectUri += "&birthday=" + birthday;
        }
        if (!profileImage.isEmpty()) {
            frontendRedirectUri += "&profileImage=" + URLEncoder.encode(profileImage, StandardCharsets.UTF_8);
        }

        return new RedirectView(frontendRedirectUri);
    }
}