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

    @Override
    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    public List<User> getUserById(int userId) {
        return resumeMapper.getUserById(userId);
    }

    @Override
    //내 정보 수정
    public void updateUser(User user) {
        resumeMapper.updateUser(user);
    }

    @Override
    //이력서 조회
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }

    @Override
    //이력서 post
    public void insertResume(Resume resume, EducationHistory educationHistory, CareerHistory careerHistory) {
        resumeMapper.insertResume(resume, educationHistory, careerHistory);

    }


    @Override
    public void updateResume(Resume resume, EducationHistory educationHistory, CareerHistory careerHistory) {
        resumeMapper.updateResume(resume, educationHistory, careerHistory);

    }

    @Override
    //이력서 삭제
    public void deleteResume(int resumeId) {
        resumeMapper.deleteResume(resumeId);

    }
}
