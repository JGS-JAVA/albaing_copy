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

// 이력서 기본 데이터 생성
        Resume resume = new Resume();
        resume.setUserId(user.getUserId().intValue()); // userId를 int로 변환
        resume.setResumeTitle(user.getUserName() + "의 이력서");
        resume.setResumeLocation("");
        resume.setResumeJobCategory("");
        resume.setResumeJobType("");
        resume.setResumeJobDuration("");
        resume.setResumeWorkSchedule("");
        resume.setResumeWorkTime("");
        resume.setResumeJobSkill("");
        resume.setResumeIntroduction("");

        // 이력서 저장
        resumeMapper.createResumeForUser(resume);

        // 이력서 ID 획득 (MyBatis의 selectKey를 통해 자동으로 설정됨)
        int resumeId = resume.getResumeId();

        // 기본 학력 정보 생성
        EducationHistory educationHistory = new EducationHistory();
        educationHistory.setResumeId(resumeId);
        educationHistory.setEduDegree("");
        educationHistory.setEduStatus("");
        educationHistory.setEduSchool("");
        educationHistory.setEduMajor("");
        educationHistory.setEduAdmissionYear("");
        educationHistory.setEduGraduationYear("");
        resumeMapper.createDefaultEducation(educationHistory);

        // 기본 경력 정보 생성
        CareerHistory careerHistory = new CareerHistory();
        careerHistory.setResumeId(resumeId);
        careerHistory.setCareerCompanyName("");
        careerHistory.setCareerJoinDate("");
        careerHistory.setCareerQuitDate("");
        careerHistory.setCareerJobDescription("");
        careerHistory.setCareerIsCareer("신입");
        resumeMapper.createDefaultCareer(careerHistory);
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
