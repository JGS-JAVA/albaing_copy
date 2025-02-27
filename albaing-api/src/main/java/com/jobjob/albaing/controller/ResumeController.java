package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.*;
import com.jobjob.albaing.service.ResumeServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ResumeController {

    private final ResumeServiceImpl resumeService;

    // 1. 회원가입 시 이력서 자동 생성
    @PostMapping("/resume/create")
    public ResponseEntity<?> createResumeForUser(@RequestBody User user) {
        log.info("회원가입 시 이력서 자동 생성 요청: 사용자 ID = {}", user.getUserId());
        try {
            resumeService.createResumeForUser(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("이력서 생성 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("이력서 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 2. 이력서 수정
    @PutMapping("/resume/update/{resumeId}")
    public ResponseEntity<?> updateResume(
        @PathVariable int resumeId,
        @RequestBody ResumeUpdateRequest resumeUpdateRequest) {
        try {
            // 요청 데이터 유효성 검사
            if (resumeUpdateRequest.getResume() == null ||
                resumeUpdateRequest.getResume().getResumeId() != resumeId) {
                return ResponseEntity.badRequest().body("요청 데이터가 유효하지 않습니다.");
            }
            resumeService.updateResume(resumeUpdateRequest);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("이력서 수정 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("이력서 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 3. 이력서 조회
    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<?> resumeDetails(@PathVariable int resumeId) {
        try {
            Resume resume = resumeService.resumeDetails(resumeId);
            if (resume == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            log.error("이력서 조회 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("이력서 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 4. 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable int userId) {
        log.info("사용자 정보 조회 요청: 사용자 ID = {}", userId);
        try {
            User user = resumeService.getUserById(userId);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("사용자 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 5. 사용자 정보 수정
    @PutMapping("/user/update/{userId}")
    public ResponseEntity<?> updateUser(
        @PathVariable int userId,
        @RequestParam("userEmail") String userEmail,
        @RequestParam("userAddress") String userAddress,
        @RequestParam("userProfileImage") String userProfileImage) {
        log.info("사용자 정보 수정 요청: 사용자 ID = {}", userId);
        try {
            resumeService.updateUser(userId, userEmail, userAddress, userProfileImage);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("사용자 정보 수정 중 오류: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("사용자 정보 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}