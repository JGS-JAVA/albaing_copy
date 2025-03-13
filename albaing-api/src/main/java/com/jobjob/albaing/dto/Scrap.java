package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Scrap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int scrapId;
    private int userId;
    private int jobPostId;
    private int companyId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date scrapCreatedAt;
    private boolean scrapIs;

    private String jobPostTitle;  // 공고 제목
    private String companyName;   // 회사 이름

}
