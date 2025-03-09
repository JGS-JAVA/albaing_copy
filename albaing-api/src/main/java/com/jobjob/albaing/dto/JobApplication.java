package com.jobjob.albaing.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class JobApplication {
    private int jobApplicationId;
    private int jobPostId;
    private int resumeId;
    private LocalDateTime applicationAt;
    private String approveStatus;

    // 조인 결과로 가져올 필드들 (추가)
    private String jobPostTitle;   // 공고 제목
    private String applicantName;  // 지원자 이름
}
