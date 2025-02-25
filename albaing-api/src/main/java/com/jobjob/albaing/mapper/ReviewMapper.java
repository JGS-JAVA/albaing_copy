package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Comment;
import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper

public interface ReviewMapper {

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);

    //회사 전체 공고 출력
    List<JobPost> showPosts(long companyId);

    //전체 리뷰 보여주기
    List<Review> showReviews(long companyId);

    //리뷰 등록
    void addReview(Review review);

    //리뷰 조회
    Review reviewCheck(long reviewId);

    //리뷰 삭제
    void deleteReview(long reviewId, long userId);

    //댓글 등록
    void addComment(Comment comment);

    //댓글 삭제
    void deleteComment(long commentId, long userId);
}
