import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JobpostEdit = () => {
    const { jobPostId } = useParams(); // URL에서 jobPostId를 가져옴
    const navigate = useNavigate();
    const [jobPost, setJobPost] = useState({
        jobPostTitle: "",
        jobPostOptionalImage: "",
        jobPostContactNumber: "",
        jobPostRequiredEducations: "",
        jobPostJobCategory: "",
        jobPostJobType: "",
        jobPostWorkingPeriod: "",
        jobWorkSchedule: "",
        jobPostShiftHours: "",
        jobPostSalary: "",
        jobPostWorkPlace: "",
        jobPostDueDate: "",
    });

    // 채용공고 상세 정보 불러오기
    useEffect(() => {
        const fetchJobPost = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/jobs/${jobPostId}`);
                setJobPost(response.data);
            } catch (error) {
                console.error("Error fetching job post:", error);
            }
        };
        fetchJobPost();
    }, [jobPostId]);

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/jobs/${jobPostId}`, jobPost);
            alert("채용공고가 성공적으로 수정되었습니다.");
            navigate(`/jobs/${jobPostId}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error("Error updating job post:", error);
            alert("채용공고 수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>채용공고 수정</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        name="jobPostTitle"
                        value={jobPost.jobPostTitle}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>이미지 URL:</label>
                    <input
                        type="text"
                        name="jobPostOptionalImage"
                        value={jobPost.jobPostOptionalImage}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>연락처:</label>
                    <input
                        type="text"
                        name="jobPostContactNumber"
                        value={jobPost.jobPostContactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>필요 학력:</label>
                    <input
                        type="text"
                        name="jobPostRequiredEducations"
                        value={jobPost.jobPostRequiredEducations}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>직종:</label>
                    <input
                        type="text"
                        name="jobPostJobCategory"
                        value={jobPost.jobPostJobCategory}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>근무 형태:</label>
                    <input
                        type="text"
                        name="jobPostJobType"
                        value={jobPost.jobPostJobType}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>근무 기간:</label>
                    <input
                        type="text"
                        name="jobPostWorkingPeriod"
                        value={jobPost.jobPostWorkingPeriod}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>근무 스케줄:</label>
                    <input
                        type="text"
                        name="jobWorkSchedule"
                        value={jobPost.jobWorkSchedule}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>근무 시간:</label>
                    <input
                        type="text"
                        name="jobPostShiftHours"
                        value={jobPost.jobPostShiftHours}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>급여:</label>
                    <input
                        type="text"
                        name="jobPostSalary"
                        value={jobPost.jobPostSalary}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>근무 장소:</label>
                    <input
                        type="text"
                        name="jobPostWorkPlace"
                        value={jobPost.jobPostWorkPlace}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>마감일:</label>
                    <input
                        type="date"
                        name="jobPostDueDate"
                        value={jobPost.jobPostDueDate}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default JobpostEdit;