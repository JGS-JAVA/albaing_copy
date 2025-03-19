package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Notice;
import java.util.List;

public interface NoticeService {
    List<Notice> getAllNotices();
    Notice getNoticeById(Integer noticeId);
    void addNotice(Notice notice);
    void updateNotice(Notice notice);
    void deleteNotice(Integer noticeId);
    List<Notice> searchNotices(String keyword);
}