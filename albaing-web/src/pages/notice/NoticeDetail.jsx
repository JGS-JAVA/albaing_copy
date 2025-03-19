import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '../../components';

const NoticeDetail = () => {
    const { noticeId } = useParams();
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNoticeDetail = () => {
            setLoading(true);
            axios.get(`/api/notices/${noticeId}`)
                .then(response => {
                    setNotice(response.data);
                    setError(null);
                })
                .catch(err => {
                    console.error('공지사항 상세 로딩 오류:', err);
                    setError('공지사항을 불러오는데 실패했습니다.');
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        fetchNoticeDetail();
    }, [noticeId]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!notice) return <ErrorMessage message="공지사항을 찾을 수 없습니다." />;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold">{notice.noticeTitle}</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        등록일: {formatDate(notice.noticeCreatedAt)}
                        {notice.noticeUpdatedAt && notice.noticeCreatedAt !== notice.noticeUpdatedAt &&
                            ` (수정됨: ${formatDate(notice.noticeUpdatedAt)})`
                        }
                    </p>
                </div>

                <div className="px-6 py-8">
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => navigate('/notices')}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    목록으로 돌아가기
                </button>
            </div>
        </div>
    );
};

export default NoticeDetail;