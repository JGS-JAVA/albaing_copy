package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Scrap;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ScrapService {

    //scrap한 공고 insert
    void insertScrap(int userId, int jobPostId);

    //scrap 공고 삭제
    void deleteScrap(int ScrapId);

    //scrap 공고 조회
    List<Scrap> getScrapsByUser(int userId);
}
