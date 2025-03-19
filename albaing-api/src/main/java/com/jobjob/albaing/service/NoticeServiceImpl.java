package com.jobjob.albaing.service;

import com.jobjob.albaing.dto.Notice;
import com.jobjob.albaing.mapper.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Override
    public List<Notice> getAllNotices() {
        return noticeMapper.getAllNotices();
    }

    @Override
    public Notice getNoticeById(Integer noticeId) {
        return noticeMapper.getNoticeById(noticeId);
    }

    @Override
    public void addNotice(Notice notice) {
        noticeMapper.insertNotice(notice);
    }

    @Override
    public void updateNotice(Notice notice) {
        noticeMapper.updateNotice(notice);
    }

    @Override
    public void deleteNotice(Integer noticeId) {
        noticeMapper.deleteNotice(noticeId);
    }

    @Override
    public List<Notice> searchNotices(String keyword) {
        return noticeMapper.searchNotices(keyword);
    }
}