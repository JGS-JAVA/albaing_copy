package com.jobjob.albaing.service;

public interface NotificationService {
    /**
     * 공고 승인 알림 발송
     * @param userId 사용자 ID
     * @param jobPostTitle 공고 제목
     * @param companyName 회사명
     * @return 발송 성공 여부
     */
    boolean sendJobApprovalNotification(Long userId, String jobPostTitle, String companyName);
}