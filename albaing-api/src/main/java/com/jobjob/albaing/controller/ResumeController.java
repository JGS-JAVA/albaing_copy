package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.CareerHistory;
import com.jobjob.albaing.dto.EducationHistory;
import com.jobjob.albaing.dto.Resume;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ResumeService;
import com.jobjob.albaing.service.ResumeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
public class ResumeController {

    @Autowired
    private ResumeServiceImpl resumeService;

    // 1. 회원가입 시 이력서 자동 생성 (POST)
    @PostMapping("/signup")
    public ResponseEntity<Void> createResumeForNewUser(@RequestBody User user) {
        // 회원가입 완료 후
        // 사용자 정보를 이용해 이력서 자동 생성
        resumeService.createResumeForUser(user);
        return ResponseEntity.created(null).build();  // 회원가입 완료 후 이력서 자동 생성
    }

    // 2. 이력서 수정
    @PutMapping("/resume/update/{resumeId}")
    public ResponseEntity<Void> updateResume(
            @PathVariable int resumeId,
            @RequestBody Resume resume,
            @RequestBody EducationHistory educationHistory,
            @RequestBody CareerHistory careerHistory) {
        // 이력서 수정
        resumeService.updateResume(resume, educationHistory, careerHistory);
        return ResponseEntity.noContent().build();  // 이력서 수정 완료
    }

    // 3. 이력서 조회
    @GetMapping("/resume/{resumeId}")
    public ResponseEntity<Resume> getResumeDetails(@PathVariable int resumeId) {
        Resume resume = resumeService.resumeDetails(resumeId);
        return ResponseEntity.ok(resume);  // 이력서 상세 조회
    }

    // 4. 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<User>> getUserInfo(@PathVariable int userId) {
        List<User> user = resumeService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // 5. 사용자 정보 수정
    @PutMapping("/user/update")
    public void updateUser(@PathVariable int userId, @RequestParam("userEmail") String userEmail,
                           @RequestParam("userAddress") String userAddress,
                           @RequestParam("userProfileImage") String userProfileImage) {
       return resumeService.updateUser(userEmail,userAddress,userProfileImage);
    }
}



}
