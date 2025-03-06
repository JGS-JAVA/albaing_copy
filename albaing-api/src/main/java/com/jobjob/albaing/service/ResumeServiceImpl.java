
package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.mapper.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

    // 회원가입 시 이력서 생성
    @Override
    public void createResumeForUser(User user) {
        Resume existingResume = resumeMapper.getResumeByUserId(user.getUserId().intValue());

        if (existingResume != null) {
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

        CareerHistory careerHistory = new CareerHistory();
        careerHistory.setResumeId(resumeId);
        careerHistory.setCareerCompanyName("");
        careerHistory.setCareerJoinDate("");
        careerHistory.setCareerQuitDate("");
        careerHistory.setCareerJobDescription("");
        careerHistory.setCareerIsCareer("신입");
        resumeMapper.createDefaultCareer(careerHistory);
    }


    // 이력서 상세 조회
    @Override
    public Resume resumeDetails(int resumeId) {
        return resumeMapper.resumeDetails(resumeId);
    }

    // 이력서 수정
    @Override
    public void updateResume(ResumeUpdateRequest resumeUpdateRequest) {
        try {
            // 이력서 기본 정보 업데이트
            if (resumeUpdateRequest.getResume() != null) {
                resumeMapper.updateResume(resumeUpdateRequest);
            }

            // 학력 정보 업데이트
            if (resumeUpdateRequest.getEducationHistory() != null) {
                resumeMapper.updateEducation(resumeUpdateRequest);
            }

            // 경력 정보 업데이트
            if (resumeUpdateRequest.getCareerHistory() != null) {
                resumeMapper.updateCareer(resumeUpdateRequest);
            }
        } catch (Exception e) {
            throw new RuntimeException("이력서 수정 중 오류가 발생했습니다.", e);
        }
    }
}
