package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Scrap;
import com.jobjob.albaing.mapper.ScrapMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScrapServiceImpl implements ScrapService {
    @Autowired
    private ScrapMapper scrapMapper;

    //스크랩 추가
    @Override
    public void insertScrap(int userId, int jobPostId) {
        boolean isAlreadyScraped = scrapMapper.checkScrap(userId, jobPostId);
        if (isAlreadyScraped) {
            return;
        }
        scrapMapper.insertScrap(userId, jobPostId);
    }

    //스크랩 삭제
    @Override
    public void deleteScrap(int userId, int jobPostId) {
        scrapMapper.deleteScrap(userId, jobPostId);
    }

    //특정 사용자 스크랩 목록 조회
    @Override
    public List<Scrap> getScrapsByUser(int userId) {
        return scrapMapper.getScrapsByUser(userId);
    }
}
