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
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long commentId; //댓글 아이디
    private Long reviewId; //리뷰 아이디
    private Long userId; //작성자 아이디
    private LocalDateTime commentCreatedAt; //댓글 생성날짜
    private LocalDateTime commentUpdatedAt; //댓글 수정날짜
    private String commentContent; //댓글 내용
}
