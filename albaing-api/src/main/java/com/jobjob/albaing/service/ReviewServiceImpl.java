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

    @Override
    public Company companyDetail(long companyId) {
        return reviewMapper.companyDetail(companyId);
    }

    @Override
    public List<JobPost> showPosts(long companyId) {
        return reviewMapper.showPosts(companyId);
    }

    @Override
    public List<Review> showReviews(long companyId) {
        return reviewMapper.showReviews(companyId);
    }

    @Override
    public void addReview(Review review) {
        reviewMapper.addReview(review);
    }

    @Override
    public Review reviewCheck(long reviewId) {
        return reviewMapper.reviewCheck(reviewId);
    }

    @Override
    public void deleteReview(long reviewId, long userId) {
        reviewMapper.deleteReview(reviewId, userId);
    }

    @Override
    public void addComment(Comment comment) {
        reviewMapper.addComment(comment);
    }

    @Override
    public void deleteComment(long commentId, long userId) {
        reviewMapper.deleteComment(commentId, userId);
    }
}
