package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;

import java.util.List;

public interface ReviewService {

    //특정 회사 전체 리뷰 보여주기
    List<Review> showReviews(long companyId);

    //회사 리뷰 등록
    void addReview(Review review);

    //회사 리뷰 조회
    Review reviewCheck(long reviewId);

    //회사 리뷰 삭제
    void deleteReview(long reviewId, long userId);

    //리뷰 댓글 등록
    void addComment(Comment comment);

    //리뷰 댓글 삭제
    void deleteComment(long commentId, long userId);
}
