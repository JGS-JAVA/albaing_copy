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
@RequestMapping("/oauth/naver")
public class NaverAPIController {

    //  @Value("${properties 작성한 변수이름}")
    //           ${} 내부에서 ctrl + space 누르면 properties 에서 가져올 수 있는 변수이름 표기
    @Value("${naver.client-id}")
    private String naverClientId; // properties에서 가져온 값이 naverClientId 변수이름에 저장됨

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-url}")
    private String naverRedirectUrl;
   /*
       아래와 같이 직접적으로 properties 에 작성한 값을 넣을 수 있지만
       id나 secret 키가 유출될 가능성이 높기 때문에 properties 파일에 작성 후 가져오는 형식으로 설정
       private String naverRedirectUrl = "http://localhost:8080/oauth/naver/callback";
    */


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
    public String handleCallback(@RequestParam("code") String code,
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
                return "redirect:/error?message=네이버 로그인 실패";
            }

            String accessToken = (String) response.getBody().get("access_token");

            String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> userRequest = new HttpEntity<>(userHeaders);
            ResponseEntity<Map> userResponse = restTemplate.postForEntity(userInfoUrl, userRequest, Map.class);

            if (userResponse.getBody() == null || !userResponse.getBody().containsKey("response")) {
                System.err.println("🚨 네이버 사용자 정보를 가져올 수 없습니다.");
                return "redirect:/error?message=사용자 정보 없음";
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

            // gender 데이터를 frontend 로 전달할 때 f -> female 변형해서 전달
            String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);
            String encodedNickname = URLEncoder.encode(nickname, StandardCharsets.UTF_8);

            return "redirect:/register/person?name=" + encodedName + "&email=" + email +"&nickname="+encodedNickname + "&gender="+gender+"&birthday="+birthday+"&profileImage="+profileImage ;

        } catch (Exception e) {
            System.err.println("🚨 네이버 로그인 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return "redirect:/error?message=네이버 로그인 오류 발생";
        }
    }
}

