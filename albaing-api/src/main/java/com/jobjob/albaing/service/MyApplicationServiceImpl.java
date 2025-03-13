package com.jobjob.albaing.service;

import com.jobjob.albaing.mapper.MyApplicationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MyApplicationServiceImpl implements MyApplicationService {

    @Autowired
    MyApplicationMapper myApplicationMapper;

    @Override
    public List<Map<String, Object>> getUserApplications(int resumeId) {
       return myApplicationMapper.getUserApplications(resumeId);
    }

    // 지원 개수, 승인 대기, 합격, 불합격 개수 가져오기
    public Map<String, Object> getApplicationStatus(int resumeId) {
        Map<String, Object> result = new HashMap<>();
        result.put("totalApplications", myApplicationMapper.countUserApplication(resumeId));
        result.put("approving", myApplicationMapper.countApproving(resumeId));
        result.put("approved", myApplicationMapper.countApproved(resumeId));
        result.put("denied", myApplicationMapper.countDenied(resumeId));
        return result;
    }
}
