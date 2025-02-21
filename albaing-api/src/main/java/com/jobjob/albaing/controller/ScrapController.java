package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Scrap;
import com.jobjob.albaing.service.ScrapService;
import com.jobjob.albaing.service.ScrapServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrap")
public class ScrapController {

    @Autowired
    private ScrapServiceImpl scrapService;

    // 스크랩 추가
    @PostMapping("/add")
    public void insertScrap(@RequestParam int userId, @RequestParam int jobPostId) {
        scrapService.insertScrap(userId, jobPostId);
    }

    // 스크랩 삭제
    @DeleteMapping("/remove/{scrapId}")
    public void deleteScrap(@PathVariable int scrapId) {
        scrapService.deleteScrap(scrapId);
    }

    // 특정 사용자의 스크랩 목록 조회
    @GetMapping("/{userId}")
    public List<Scrap> getScrapsByUser(@PathVariable int userId) {
        return scrapService.getScrapsByUser(userId);
    }


}
