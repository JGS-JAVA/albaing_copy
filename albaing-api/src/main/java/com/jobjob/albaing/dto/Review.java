package com.jobjob.albaing.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long reviewId; //리뷰 아이디
    private Long userId; //작성자 아이디
    private Long companyId; //기업 아이디
    private String reviewTitle; //리뷰 제목
    private String reviewContent; //리뷰 내용
    private LocalDateTime reviewCreatedAt; //리뷰 생성날짜
    private LocalDateTime reviewUpdatedAt; //리뷰 수정날짜
}
