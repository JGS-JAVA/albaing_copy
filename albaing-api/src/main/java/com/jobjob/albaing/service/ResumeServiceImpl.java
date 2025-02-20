package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.CareerHistory;
import com.jobjob.albaing.dto.EducationHistory;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
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
    public void updateUser(String userEmail, String userAddress, String userProfileImage) {
        resumeMapper.updateUser(userEmail, userAddress, userProfileImage);
    }

    //이력서 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }

    //이력서 post
    @Override
    public void insertResume(Resume resume, EducationHistory educationHistory, CareerHistory careerHistory) {
        resumeMapper.insertResume(resume, educationHistory, careerHistory);

    }

    //이력서 수정
    @Override
    public void updateResume(Resume resume, EducationHistory educationHistory, CareerHistory careerHistory) {
        resumeMapper.updateResume(resume, educationHistory, careerHistory);

    }



}
