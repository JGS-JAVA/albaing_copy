package com.jobjob.albaing.service;

import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

public interface MyApplicationService {

    // 사용자가 지원한 공고 목록 조회
    List<Map<String, Object>> getUserApplications(@RequestParam("resumeId") int resumeId);
    Map<String, Object> getApplicationStatus(int resumeId);
}
