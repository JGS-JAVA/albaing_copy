package com.jobjob.albaing.service;

public interface KakaoNotificationService {
    /**
     * 카카오톡 메시지 발송
     * @param kakaoId 카카오 사용자 ID
     * @param title 메시지 제목
     * @param content 메시지 내용
     * @return 발송 성공 여부
     */
    boolean sendKakaoMessage(String kakaoId, String title, String content);
}