package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.mapper.ReviewMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    //특정 회사 전체 리뷰 보여주기
    @Override
    public List<Review> showReviews(long companyId) {
        return reviewMapper.showReviews(companyId);
    }

    //회사 리뷰 등록
    @Override
    public void addReview(Review review) {
        reviewMapper.addReview(review);
    }

    //회사 리뷰 조회
    @Override
    public Review reviewCheck(long reviewId) {
        return reviewMapper.reviewCheck(reviewId);
    }

    //회사 리뷰 삭제
    @Override
    public void deleteReview(long reviewId, long userId) {
        reviewMapper.deleteReview(reviewId, userId);
    }

    //리뷰 댓글 등록
    @Override
    public void addComment(Comment comment) {
        reviewMapper.addComment(comment);
    }

    //리뷰 댓글 삭제
    @Override
    public void deleteComment(long commentId, long userId) {
        reviewMapper.deleteComment(commentId, userId);
    }
}
