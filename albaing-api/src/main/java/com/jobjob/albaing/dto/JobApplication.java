package com.jobjob.albaing.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

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
    private LocalDateTime applicationAt;
    private String approveStatus;
}
