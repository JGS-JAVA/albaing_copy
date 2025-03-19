package com.jobjob.albaing.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Notice {
    private Integer noticeId;
    private String noticeTitle;
    private String noticeContent;
    private LocalDateTime noticeCreatedAt;
    private LocalDateTime noticeUpdatedAt;
}