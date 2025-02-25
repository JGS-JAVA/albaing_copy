package com.jobjob.albaing.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString
@NoArgsConstructor
public class JobApplication {
    private int jobApplicationId;
    private int jobPostId;
    private int resumeId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date applicationAt;
    private LocalDateTime applicationAt;
    private String approveStatus;
}
