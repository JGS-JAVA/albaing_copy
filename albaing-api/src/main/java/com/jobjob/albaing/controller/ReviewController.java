package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ReviewServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/company/detail")
public class ReviewController {

    @Autowired
    private ReviewServiceImpl reviewService;

    //전체 리뷰 보여주기
    @GetMapping("/{companyId}/review")
    public String showReviews(@PathVariable("companyId") long companyId, Model model) {
        List<Review> reviews = reviewService.showReviews(companyId);

        model.addAttribute("reviews", reviews);
        model.addAttribute("companyId", companyId);

        return "companyDetail";
    }

    //리뷰 등록
    @PostMapping("/{companyId}/review")
    public void addReview(@PathVariable("companyId") long companyId, @RequestBody Review review) {
        review.setCompanyId(companyId);
        reviewService.addReview(review);
    }

    //리뷰 조회
    @GetMapping("/{companyId}/review/{reviewId}")
    public String reviewCheck(@PathVariable("reviewId") long reviewId, Model model, HttpServletRequest request) {
        Review review = reviewService.reviewCheck(reviewId);

        if (review == null) {
            return "redirect:companyDetail";
        }

        model.addAttribute("review", review);

        return "company/reviewDetail";
    }

    //댓글 등록
    @PostMapping("/{companyId}/review/{reviewId}/comment")
    public void addComment(@PathVariable("reviewId") long commentId, @RequestBody Comment comment) {
        comment.setCommentId(commentId);
        reviewService.addComment(comment);
    }

    //리뷰 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}")
    public void deleteReview(@PathVariable("reviewId") long reviewId, @RequestParam long userId) {
        reviewService.deleteReview(reviewId, userId);
    }

    //댓글 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}/comment/{commentId}")
    public void deleteComment(@PathVariable("commentId") long commentId, @RequestParam long userId) {
        reviewService.
            deleteComment(commentId, userId);
    }


    /* ===== 어드민 리뷰 관리 기능 ===== */

    // 어드민용 - 모든 리뷰 조회
    @GetMapping("/admin/reviews")
    public ResponseEntity<?> getAllReviewsForAdmin(HttpSession session) {
        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        List<Map<String, Object>> reviews = reviewService.getAllReviewsForAdmin();
        return ResponseEntity.ok(reviews);
    }

    // 어드민용 - 리뷰 추가
    @PostMapping("/admin/reviews")
    public ResponseEntity<?> addReviewByAdmin(
        @RequestBody Review review,
        HttpSession session) {

        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.addReview(review);
        return ResponseEntity.ok().build();
    }

    // 어드민용 - 리뷰 수정
    @PutMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<?> updateReviewByAdmin(
        @PathVariable long reviewId,
        @RequestBody Review review,
        HttpSession session) {

        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        review.setReviewId(reviewId);
        // 어드민은 모든 리뷰 수정 가능
        boolean success = reviewService.updateReviewByAdmin(review);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "리뷰가 존재하지 않습니다."));
        }
    }

    // 어드민용 - 리뷰 삭제
    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<?> deleteReviewByAdmin(
        @PathVariable long reviewId,
        HttpSession session) {

        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteReviewByAdmin(reviewId);
        return ResponseEntity.ok().build();
    }

    // 어드민용 - 댓글 추가
    @PostMapping("/admin/reviews/{reviewId}/comments")
    public ResponseEntity<?> addCommentByAdmin(
        @PathVariable long reviewId,
        @RequestBody Comment comment,
        HttpSession session) {

        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        comment.setReviewId(reviewId);
        comment.setUserId(user.getUserId());
        reviewService.addComment(comment);
        return ResponseEntity.ok().build();
    }

    // 어드민용 - 댓글 삭제
    @DeleteMapping("/admin/reviews/{reviewId}/comments/{commentId}")
    public ResponseEntity<?> deleteCommentByAdmin(
        @PathVariable long reviewId,
        @PathVariable long commentId,
        HttpSession session) {

        User user = (User) session.getAttribute("userSession");
        if (user == null || !user.getUserIsAdmin()) {
            return ResponseEntity.status(403).body(Map.of("message", "관리자 권한이 필요합니다."));
        }

        reviewService.deleteCommentByAdmin(commentId);
        return ResponseEntity.ok().build();
    }


    // 회사용 - 자사 리뷰 목록 조회
    @GetMapping("/company/{companyId}/reviews")
    public ResponseEntity<?> getCompanyReviews(
        @PathVariable long companyId,
        HttpSession session) {

        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        List<Review> reviews = reviewService.showReviews(companyId);
        return ResponseEntity.ok(reviews);
    }

    // 회사용 - 리뷰 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}")
    public ResponseEntity<?> deleteReviewByCompany(
        @PathVariable long companyId,
        @PathVariable long reviewId,
        HttpSession session) {

        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        // 회사는 자사에 대한 리뷰만 삭제 가능
        boolean success = reviewService.deleteReviewByCompany(reviewId, companyId);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "리뷰가 존재하지 않거나 삭제할 권한이 없습니다."));
        }
    }

    // 회사용 - 댓글 삭제
    @DeleteMapping("/{companyId}/review/{reviewId}/comment/{commentId}")
    public ResponseEntity<?> deleteCommentByCompany(
        @PathVariable long companyId,
        @PathVariable long reviewId,
        @PathVariable long commentId,
        HttpSession session) {

        Company company = (Company) session.getAttribute("companySession");
        if (company == null || !company.getCompanyId().equals(companyId)) {
            return ResponseEntity.status(403).body(Map.of("message", "권한이 없습니다."));
        }

        // 회사는 자사 리뷰의 댓글만 삭제 가능
        boolean success = reviewService.deleteCommentByCompany(commentId, reviewId, companyId);
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "댓글이 존재하지 않거나 삭제할 권한이 없습니다."));
        }
    }
}