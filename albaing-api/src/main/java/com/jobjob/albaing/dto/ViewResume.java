package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Date;

public class ViewResume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userEmail;
    private String userPassword;
    private String userName;
    private Date userBirthdate;
    private User.Gender userGender;
    private String userPhone;
    private String userAddress;
    private String userProfileImage;
    private LocalDateTime userCreatedAt;
    private LocalDateTime userUpdatedAt;
    private Boolean userTermsAgreement;
    private Boolean userIsAdmin;

    public enum Gender {
        male, female
    }

    private int resumeId;
    private String resumeTitle;
    private String resumeLocation;
    private String resumeJobCategory;
    private String resumeJobType;
    private String resumeJobDuration;
    private String resumeWorkSchedule;
    private String resumeWorkTime;
    private String resumeJobSkill;
    private String resumeIntroduction;

    private EducationHistory educationHistory;
    private CareerHistory careerHistory;

    private String sortOrderBy;
    private Boolean isDESC;
}
