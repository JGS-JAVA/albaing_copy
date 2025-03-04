package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;
import com.jobjob.albaing.mapper.ReviewMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    // 어드민 회사 전체 리스트
    @Override
    public List<Map<String, Object>> getAllReviewsForAdmin() {
        return reviewMapper.getAllReviewsForAdmin();
    }

    // 어드민 리뷰 수정
    @Override
    public boolean updateReviewByAdmin(Review review) {
        return reviewMapper.updateReviewByAdmin(review) > 0;
    }

    // 어드민 리뷰 삭제
    @Override
    public void deleteReviewByAdmin(long reviewId) {
        reviewMapper.deleteReviewByAdmin(reviewId);
    }

    // 어드민 댓글 삭제
    @Override
    public void deleteCommentByAdmin(long commentId) {
        reviewMapper.deleteCommentByAdmin(commentId);
    }

    // 자회사 리뷰 삭제
    @Override
    public boolean deleteReviewByCompany(long reviewId, long companyId) {

        Review review = reviewMapper.getReviewById(reviewId);
        if (review == null || review.getCompanyId() != companyId) {
            return false;
        }

        // 리뷰 삭제
        return reviewMapper.deleteReviewByCompany(reviewId, companyId) > 0;
    }

    // 자회사 댓글 삭제
    @Override
    public boolean deleteCommentByCompany(long commentId, long reviewId, long companyId) {

        Map<String, Object> params = new HashMap<>();
        params.put("commentId", commentId);
        params.put("reviewId", reviewId);
        params.put("companyId", companyId);

        Integer count = reviewMapper.checkCommentBelongsToCompany(params);
        if (count == null || count == 0) {
            return false;
        }

        return reviewMapper.deleteCommentByCompany(params) > 0;
    }
}
