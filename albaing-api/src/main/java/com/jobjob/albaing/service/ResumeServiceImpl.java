package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

    // 회원가입시 이력서 생성
    @Override
    public void createResumeForUser(User user){
        resumeMapper.createResumeForUser(user);
    }

    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    @Override
    public User getUserById(int userId) {
        return resumeMapper.getUserById(userId);
    }

    //내 정보 수정
    @Override
    public void updateUser(int userId,String userEmail, String userAddress, String userProfileImage) {
        resumeMapper.updateUser(userId, userEmail, userAddress, userProfileImage);
    }

    //이력서 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }

    //이력서 post
    @Override
    public void insertResume(ResumeUpdateRequest resumeUpdateRequest) {
        resumeMapper.insertResume(resumeUpdateRequest);

    }

    //이력서 수정
    @Override
    public void updateResume(ResumeUpdateRequest resumeUpdateRequest) {
        resumeMapper.updateResume(resumeUpdateRequest);

    }



}
