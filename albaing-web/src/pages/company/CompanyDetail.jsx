import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";

const CompanyDetail = () => {
    const {companyId} = useParams();
    const [company,setCompany] = useState(null);
    const [jobPost,setJobPost] = useState([]);
    const [review, setReview] = useState([]);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
            axios.get(`http://localhost:8080/api/company/${companyId}`)
                .then((res) => {
                    setCompany(res.data)
                })
                .catch((err) => {
                    alert("데이터를 가져올 수 없습니다.");
                    console.log("확인된 오류 : ", err);
                })
    }, [companyId]);

    useEffect(() => {
        if (activeTab === "jobs") {
            axios.get(`http://localhost:8080/api/jobs/company/${companyId}`)
                .then((res) => {
                    setJobPost(res.data)
                })
                .catch((err) => {
                    alert("데이터를 가져올 수 없습니다.");
                    console.log("확인된 오류 : ", err);
                })
        }
    }, [activeTab, companyId]);

    useEffect(() => {
        if (activeTab === "reviews") {
            axios.get(`http://localhost:8080/api/companies/${companyId}/reviews`)
                .then((res) => {
                    setReview(res.data)
                })
                .catch((err) => {
                    alert("데이터를 가져올 수 없습니다.");
                    console.log("확인된 오류 : ", err);
                })
        }
    }, [activeTab, companyId]);

    const paginatedJobs = jobPost.slice((page - 1) * jobPostPerPage, page * jobPostPerPage);

    return (
        <div className="companydetail-container">
            <h1>{company.companyName}</h1>

            {/* 탭 기능 작동 */}
            <div>
                {["info", "jobs", "reviews"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}>
                        {tab === "info" ? "정보" : tab === "jobs" ? "채용" : "리뷰"}
                    </button>
                ))}
            </div>

            {/* 정보 탭 */}
            <div>
                {activeTab === "info" && (
                    <div>
                        <div>
                            <span>대표자</span>
                            <span>{company.companyOwnerName}</span>
                        </div>
                        <div>
                            <span>설립일</span>
                            <span>{company.companyOpenDate}</span>
                        </div>
                        <div>
                            <span>이메일</span>
                            <span>{company.companyEmail}</span>
                        </div>
                        <div>
                            <span>전화번호</span>
                            <span>{company.companyPhone}</span>
                        </div>
                        <div>
                            <span>주소</span>
                            <span>{company.companyLocalAddress}</span>
                        </div>
                        <div>
                            <span>기업 소개</span>
                            <span>{company.companyDescription}</span>
                        </div>
                    </div>
                )}

                {/* 채용 탭 */}
                {activeTab === "jobs" && (
                    <div>
                        <h2>현재 해당 기업이 채용 중인 공고</h2>
                        <div>
                            {paginatedJobs.map((job) => (
                                <div key={job.jobPostId}>
                                    <h3>{job.jobPostTitle}</h3>
                                    <p>{job.jobPostWorkPlace}</p>
                                    <p>마감일: {job.jobPostDueDate}</p>
                                    <button>지원하기</button>
                                </div>
                            ))}
                        </div>

                        {/* 페이지네이션 */}

                    </div>
                )}

                {/* 리뷰 탭 */}
                {activeTab === "reviews" && <p>리뷰 정보가 여기에 표시됩니다.</p>}
            </div>
        </div>
    );
};

export default CompanyDetail;