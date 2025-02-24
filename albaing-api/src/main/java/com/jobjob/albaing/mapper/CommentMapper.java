package com.jobjob.albaing.mapper;

public interface CommentMapper {

    //댓글 등록
    void addComment(long commentId, long reviewId, long userId, String commentContent);

    //댓글 삭제
    void deleteComment(long commentId, long userId);

}
