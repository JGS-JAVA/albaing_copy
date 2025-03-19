package com.jobjob.albaing.controller;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.dto.User;
import com.jobjob.albaing.service.ResumeServiceImpl;
import com.jobjob.albaing.service.ReviewServiceImpl;
import com.jobjob.albaing.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private ResumeServiceImpl resumeService;
    @Autowired
    private ReviewServiceImpl reviewService;


    // 마이페이지 - 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public User getUserById(@PathVariable int userId) {
        return userService.getUserById(userId);
    }

    // 마이페이지 - 사용자 정보 수정
    @PutMapping("/update/{userId}")
    public void updateUser(@RequestBody User user, @PathVariable int userId) {
        userService.updateUser(user);
    }

    // 내가 작성한 리뷰 목록 조회
    @GetMapping("/user/{userId}/reviews")
    public List<Review> getUserReviews(@PathVariable long userId) {
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        System.out.println("Fetched reviews for user " + userId + ": " + reviews);
        return reviews;
    }

    // 내가 작성한 댓글 목록 조회
    @GetMapping("/user/{userId}/comments")
    public List<Comment> getUserComments(@PathVariable long userId) {
        List<Comment> comments = reviewService.getCommentsByUser(userId);
        System.out.println("Fetched comments for user " + userId + ": " + comments);
        return comments;
    }

    // 내가 작성한 리뷰 삭제
    @DeleteMapping("/user/{userId}/reviews/{reviewId}")
    public void deleteUserReview(@PathVariable long userId, @PathVariable long reviewId) {
        reviewService.deleteReviewByUser(reviewId, userId);
    }

    // 내가 작성한 댓글 삭제
    @DeleteMapping("/user/{userId}/comments/{commentId}")
    public void deleteUserComment(@PathVariable long userId, @PathVariable long commentId) {
        reviewService.deleteCommentByUser(commentId, userId);
    }
}
