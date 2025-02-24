package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Company;
import com.jobjob.albaing.dto.JobPost;
import com.jobjob.albaing.dto.Review;

import java.util.List;

public interface ReviewMapper {

    // 회사 상세 정보 불러오기
    Company companyDetail(long companyId);

    //회사 전체 공고 출력
    List<JobPost> showPosts(long jobPostId);

    //전체 리뷰 보여주기
    List<Review> showReviews(long reviewId);

    //리뷰 등록
    void addReview(long reviewId, long userId, long companyId, String reviewTitle, String reviewContent);

    //리뷰 조회
    Review reviewCheck(long reviewId);

    //리뷰 삭제
    void deleteReview(long reviewId, long userId);
}
