package com.jobjob.albaing.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class Scrap {
    private int scrapId;
    private int userId;
    private int jobPostId;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date scrapCreatedAt;
    private boolean scrapIs;

}
