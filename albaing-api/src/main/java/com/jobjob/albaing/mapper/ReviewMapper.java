package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper

public interface ReviewMapper {

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
