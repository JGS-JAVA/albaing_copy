import { useState } from "react";
import axios from "axios";

const JobpostAdd = () => {
    const [formData, setFormData] = useState({
        companyId: "",
        jobPostTitle: "",
        jobPostOptionalImage: "",
        jobPostContactNumber: "",
        jobPostRequiredEducations: "",
        jobPostJobCategory: "",
        jobPostJobType: "",
        jobPostWorkingPeriod: "",
        jobPostWorkSchedule: "",
        jobPostShiftHours: "",
        jobPostSalary: "",
        jobPostWorkPlace: "",
        jobPostStatus: true,
        jobPostDueDate: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/jobs", formData);
            alert("채용 공고가 등록되었습니다.");
        } catch (error) {
            console.error("채용 공고 등록 실패", error);
            alert("채용 공고 등록에 실패했습니다.");
        }
    };

    // ENUM 값을 배열로 정의
    const jobCategories = [
        "외식/음료", "유통/판매", "문화/여가생활", "서비스",
        "사무/회계", "고객상담/리서치", "생산/건설/노무",
        "IT/기술", "디자인", "미디어", "운전/배달",
        "병원/간호/연구", "교육/강사"
    ];

    const shiftHours = [
        "무관", "오전(06:00~12:00)", "오후(12:00~18:00)",
        "저녁(18:00~24:00)", "새벽(00:00~06:00)"
    ];

    return (
        <div>
            <h2>채용 공고 등록</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="jobPostTitle" placeholder="공고 제목" onChange={handleChange} required />
                <input type="text" name="companyId" placeholder="회사 ID" onChange={handleChange} required />
                <input type="text" name="jobPostContactNumber" placeholder="연락처" onChange={handleChange} required />
                <input type="text" name="jobPostRequiredEducations" placeholder="학력 요구사항" onChange={handleChange} />

                {/* 드롭다운 메뉴로 변경 */}
                <select name="jobPostJobCategory" onChange={handleChange} required>
                    <option value="">직무 카테고리 선택</option>
                    {jobCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>

                <input type="text" name="jobPostJobType" placeholder="고용 형태" onChange={handleChange} required />
                <input type="text" name="jobPostWorkingPeriod" placeholder="근무 기간" onChange={handleChange} />
                <input type="text" name="jobPostWorkSchedule" placeholder="근무 일정" onChange={handleChange} />

                {/* 근무 시간 드롭다운 */}
                <select name="jobPostShiftHours" onChange={handleChange} required>
                    <option value="">근무 시간 선택</option>
                    {shiftHours.map((shift, index) => (
                        <option key={index} value={shift}>{shift}</option>
                    ))}
                </select>

                <input type="text" name="jobPostSalary" placeholder="급여" onChange={handleChange} required />
                <input type="text" name="jobPostWorkPlace" placeholder="근무 장소" onChange={handleChange} required />
                <input type="date" name="jobPostDueDate" onChange={handleChange} required />
                <button type="submit">등록</button>
            </form>
        </div>
    );
};

export default JobpostAdd;
