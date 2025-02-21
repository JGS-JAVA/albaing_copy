package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.CareerHistory;
import com.jobjob.albaing.dto.EducationHistory;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeMapper {

    //user 정보 불러오기 - 사진,이름,생년월일,이메일, 프로필이미지
    User getUserById(int userId);

    //내 정보 수정
    void updateUser(String userEmail, String userAddress, String userProfileImage);

    //이력서 조회
    Resume resumeDetails(int resumeId);

    //이력서 post
    void insertResume(Resume resume , EducationHistory educationHistory, CareerHistory careerHistory);

    //이력서 수정
    void updateResume(Resume resume, EducationHistory educationHistory, CareerHistory careerHistory);

    //사용자 회원가입시 이력서 자동 생성
    void createResumeForUser(User user);

}
