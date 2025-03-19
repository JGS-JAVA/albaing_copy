package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Notice;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.NoticeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    // 모든 사용자 접근 가능
    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable Integer noticeId) {
        return ResponseEntity.ok(noticeService.getNoticeById(noticeId));
    }

    @GetMapping("/notices/search")
    public ResponseEntity<List<Notice>> searchNotices(@RequestParam String keyword) {
        return ResponseEntity.ok(noticeService.searchNotices(keyword));
    }

    // 관리자만 접근 가능 - userIsAdmin으로 체크
    @PostMapping("/admin/notices")
    public ResponseEntity<?> addNotice(@RequestBody Notice notice, HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }
        noticeService.addNotice(notice);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/notices/{noticeId}")
    public ResponseEntity<?> updateNotice(@PathVariable Integer noticeId, @RequestBody Notice notice, HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }
        notice.setNoticeId(noticeId);
        noticeService.updateNotice(notice);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/notices/{noticeId}")
    public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeId, HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }
}