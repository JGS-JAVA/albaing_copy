package com.jobjob.albaing.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Mapper
public interface MyApplicationMapper {
    // 사용자가 지원한 공고 목록 조회
    List<Map<String, Object>> getUserApplications(@RequestParam("resumeId") int resumeId);

    //지원한 공고 상태별 카운팅
    int countUserApplication(@RequestParam("resumeId") int resumeId);
    int countApproving(@RequestParam("resumeId") int resumeId);
    int countApproved(@RequestParam("resumeId") int resumeId);
    int countDenied(@RequestParam("resumeId") int resumeId);


}
