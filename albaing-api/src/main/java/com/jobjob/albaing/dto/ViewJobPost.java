package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ViewJobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long jobPostId;                  // 공고 등록 번호
    private long companyId;                  // 기업 등록 번호
    private String jobPostTitle;             // 공고 제목
    private String jobPostOptionalImage;     // 공고 내용 이미지 주소
    private String jobPostContactNumber;     // 담당자(기업) 연락처
    private String jobPostRequiredEducations;// 요구 학력
    private String jobPostJobCategory;       // 직군 분류
    private String jobPostJobType;           // 근무 형태
    private String jobPostWorkingPeriod;     // 근무 기간
    private String jobWorkSchedule;          // 근무 요일
    private String jobPostShiftHours;        // 근무 시간
    private String jobPostSalary;            // 급여
    private String jobPostWorkPlace;         // 근무지
    private Boolean jobPostStatus;           // 공고 상태
    private LocalDate jobPostDueDate;        // 마감일
    private LocalDateTime jobPostCreatedAt;  // 공고 게시일
    private LocalDateTime jobPostUpdatedAt;

    private String companyName;
    private String companyRegistrationNumber;
    private String companyOwnerName;
    private Date companyOpenDate;
    private String companyPassword;
    private String companyEmail;
    private String companyPhone;
    private String companyLocalAddress;
    private Company.ApprovalStatus companyApprovalStatus;
    private LocalDateTime companyCreatedAt;
    private LocalDateTime companyUpdatedAt;
    private String companyLogo;
    private String companyDescription;

    public enum ApprovalStatus {
        approved, approving, hidden
    }

    private String sortOrderBy;
    private Boolean isDESC;
}

