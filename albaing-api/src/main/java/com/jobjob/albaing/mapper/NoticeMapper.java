package com.jobjob.albaing.mapper;

import com.jobjob.albaing.dto.Notice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface NoticeMapper {
    List<Notice> getAllNotices();
    Notice getNoticeById(Integer noticeId);
    void insertNotice(Notice notice);
    void updateNotice(Notice notice);
    void deleteNotice(Integer noticeId);
    List<Notice> searchNotices(@Param("keyword") String keyword);
}