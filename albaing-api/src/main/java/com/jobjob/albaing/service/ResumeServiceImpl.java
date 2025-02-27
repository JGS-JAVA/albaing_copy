package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ResumeServiceImpl implements ResumeService {

    private final ResumeMapper resumeMapper;

    // 회원가입 시 이력서 생성
    @Override
    public void createResumeForUser(User user) {
        log.info("이력서 생성 요청: 사용자 ID = {}", user.getUserId());
        Resume existingResume = resumeMapper.getResumeByUserId(user.getUserId().intValue());

        if (existingResume != null) {
            log.info("이미 이력서가 존재함: 사용자 ID = {}", user.getUserId());
            return;
        }

        Resume resume = new Resume();
        resume.setUserId(user.getUserId().intValue());
        resume.setResumeTitle(user.getUserName() + "의 이력서");
        resume.setResumeLocation("");
        resume.setResumeJobCategory("");
        resume.setResumeJobType("");
        resume.setResumeJobDuration("");
        resume.setResumeWorkSchedule("");
        resume.setResumeWorkTime("");
        resume.setResumeJobSkill("");
        resume.setResumeIntroduction("");

        resumeMapper.createResumeForUser(resume);
        log.info("이력서 생성 완료: 이력서 ID = {}", resume.getResumeId());

        int resumeId = resume.getResumeId();

        EducationHistory educationHistory = new EducationHistory();
        educationHistory.setResumeId(resumeId);
        educationHistory.setEduDegree("");
        educationHistory.setEduStatus("");
        educationHistory.setEduSchool("");
        educationHistory.setEduMajor("");
        educationHistory.setEduAdmissionYear("");
        educationHistory.setEduGraduationYear("");
        resumeMapper.createDefaultEducation(educationHistory);
        log.info("기본 학력 정보 생성 완료: 이력서 ID = {}", resumeId);

        CareerHistory careerHistory = new CareerHistory();
        careerHistory.setResumeId(resumeId);
        careerHistory.setCareerCompanyName("");
        careerHistory.setCareerJoinDate("");
        careerHistory.setCareerQuitDate("");
        careerHistory.setCareerJobDescription("");
        careerHistory.setCareerIsCareer("신입");
        resumeMapper.createDefaultCareer(careerHistory);
        log.info("기본 경력 정보 생성 완료: 이력서 ID = {}", resumeId);
    }

    // 사용자 정보 조회
    @Override
    public User getUserById(int userId) {
        log.info("사용자 정보 조회: 사용자 ID = {}", userId);
        return resumeMapper.getUserById(userId);
    }

    // 사용자 정보 수정
    @Override
    public void updateUser(int userId, String userEmail, String userAddress, String userProfileImage) {
        log.info("사용자 정보 수정: 사용자 ID = {}", userId);
        resumeMapper.updateUser(userId, userEmail, userAddress, userProfileImage);
    }

    // 이력서 상세 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        log.info("이력서 상세 조회: 이력서 ID = {}", resumeId);
        return resumeMapper.resumeDetails(resumeId);
    }

    // 이력서 수정
    @Override
    public void updateResume(ResumeUpdateRequest resumeUpdateRequest) {
        log.info("이력서 수정 요청: 이력서 ID = {}", resumeUpdateRequest.getResume().getResumeId());
        try {
            resumeMapper.updateResume(resumeUpdateRequest);

            if (resumeUpdateRequest.getEducationHistory() != null) {
                resumeMapper.updateEducation(resumeUpdateRequest);
            }

            if (resumeUpdateRequest.getCareerHistory() != null) {
                resumeMapper.updateCareer(resumeUpdateRequest);
            }

            log.info("이력서 수정 완료: 이력서 ID = {}", resumeUpdateRequest.getResume().getResumeId());
        } catch (Exception e) {
            log.error("이력서 수정 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("이력서 수정 중 오류가 발생했습니다.", e);
        }
    }
}