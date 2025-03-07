import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";


const ReviewDetail = () => {
    const {companyId,reviewId} = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    //조회한 리뷰 내용 불러오기
    useEffect(() => {
        axios.get(`/api/companies/${companyId}/reviews/${reviewId}`)
            .then((res) => {
                setReview(res.data);
                setComments(res.data.comments || []);
            })
            .catch((err)=> {
                console.error("리뷰 데이터를 가져오는 중 오류 발생:", err);
            })
    }, [reviewId,companyId]);

    //댓글 작성
    const CommentSubmit = async () => {
        if (!commentInput.trim()) return;

        try {
            await axios.post(`/api/companies/${companyId}/reviews/${reviewId}/comments`, {
                content: commentInput,
            });

            // 새 댓글을 UI에 반영
            const newComment = { content: commentInput, created_at: new Date() };
            setComments([...comments, newComment]);
            setCommentInput("");
        } catch (error) {
            console.error("댓글 작성 중 오류 발생:", error);
        }
    };

    if (!review) return <p>로딩 중...</p>;

    return (
        <div>
            <h2>리뷰 상세</h2>
            <div>
                <h3>{review.reviewTitle}</h3>
                <p>{new Date(review.reviewCreatedAt).toLocaleString()}</p>
                <p>{review.reviewContent}</p>
            </div>

            {/* 댓글 리스트 */}
            <div>
            <strong>댓글 ({comments.length})</strong>
                {comments.length > 0 ?
                    comments.map((c) => (
                        <div key={c.commentId}>
                            <p>{c.commentContent}</p>
                            <small>{new Date(c.commentCreatedAt).toLocaleString()}</small>
                        </div>
                    ))
                 : (
                    <p>댓글이 없습니다.</p>
                )}
            </div>

            {/* 댓글 입력 폼 */}
            <div>
                <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="댓글을 작성하세요..."
                />
                <button onClick={CommentSubmit}>작성</button>
            </div>
        </div>
    );
};

export default ReviewDetail;