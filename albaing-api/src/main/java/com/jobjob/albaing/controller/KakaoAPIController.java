package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.AuthServiceImpl;
import com.jobjob.albaing.service.UserService;
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
@RequestMapping("/oauth/kakao")
public class KakaoAPIController {

    @Autowired
    private AuthServiceImpl authService;  // ✅ AuthService로 회원 존재 여부 확인

    @Autowired
    private UserService userService;  // ✅ UserService로 카카오 ID 업데이트


    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    @Value("${kakao.client-secret}")
    private String kakaoClientSecret;

    @GetMapping("/login")
    public RedirectView getKakaoLoginUrl() {
        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize?response_type=code" +
                "&client_id=" + kakaoClientId +
                "&redirect_uri=" + redirectUri +
                "&scope=profile_nickname,profile_image,account_email,name,gender,birthday";

        return new RedirectView(kakaoAuthUrl);
    }

    @GetMapping("/callback")
    public RedirectView handleCallback(@RequestParam String code) {
        RestTemplate restTemplate = new RestTemplate();

        // 1️⃣ 카카오 토큰 요청
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        LinkedMultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        params.add("client_secret", kakaoClientSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<LinkedMultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        Map<String, Object> tokenResponse = restTemplate.postForObject(tokenUrl, tokenRequest, Map.class);

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            return new RedirectView("http://localhost:3000/error?message=Failed to get access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2️⃣ 카카오 사용자 정보 요청
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        HttpHeaders userHeaders = new HttpHeaders();
        userHeaders.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
        ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

        if (userResponse.getBody() == null) {
            return new RedirectView("http://localhost:3000/error?message=Failed to fetch user info");
        }

        // 3️⃣ 사용자 정보 파싱
        Map<String, Object> userInfo = userResponse.getBody();
        String kakaoId = userInfo.get("id").toString();  // ✅ 카카오 ID 값
        Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
        Map<String, Object> kakaoAccount = (userInfo.get("kakao_account") != null)
                ? (Map<String, Object>) userInfo.get("kakao_account")
                : new HashMap<>();

        String nickname = (String) properties.get("nickname");
        String profileImg = (String) properties.get("profile_image");
        String email = kakaoAccount.getOrDefault("email", "").toString();
        String gender = kakaoAccount.getOrDefault("gender", "").toString();
        String birthday = kakaoAccount.getOrDefault("birthday", "").toString();

        // 4️⃣ DB에서 가입 여부 확인 (AuthService에서 처리)
        if (authService.isUserExist(email)) {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                HttpSession session = request.getSession();

                // ✅ 로그인한 사용자 정보 가져오기
                User loggedInUser = authService.getUserByEmail(email);

                userService.updateUserKakaoId(loggedInUser.getUserId(), kakaoId);

                loggedInUser = authService.getUserByEmail(email);

                // ✅ 세션에 사용자 정보 저장 (일반 로그인과 동일)
                session.setAttribute("userSession", loggedInUser);

                return new RedirectView("http://localhost:3000/"); // 가입한 사용자는 메인으로 리다이렉트
            }
        }

        // ✅ `kakaoId` 포함하여 프론트로 전달
        String frontendRedirectUri = "http://localhost:3000/register/person"
                + "?nickname=" + URLEncoder.encode(nickname, StandardCharsets.UTF_8)
                + "&email=" + email
                + "&kakaoId=" + kakaoId;

        if (!gender.isEmpty()) {
            frontendRedirectUri += "&gender=" + gender;
        }
        if (!birthday.isEmpty()) {
            frontendRedirectUri += "&birthday=" + birthday;
        }
        if (!profileImg.isEmpty()) {
            frontendRedirectUri += "&profileImage=" + URLEncoder.encode(profileImg, StandardCharsets.UTF_8);
        }

        return new RedirectView(frontendRedirectUri); // 미가입 사용자는 회원가입으로 리다이렉트
    }
}


