import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function DataFetchingPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL에서 파라미터 값 가져오기 (초기값 설정)
    const [regionSelect, setRegionSelect] = useState("");
    const [jobCategorySelect, setJobCategorySelect] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // 🔹 1️⃣ URL이 변경될 때 상태 업데이트
    useEffect(() => {
        setRegionSelect(searchParams.get("regionSelect") || "");
        setJobCategorySelect(searchParams.get("jobCategorySelect") || "");
        setSearchKeyword(searchParams.get("searchKeyword") || "");
    }, [location.search]); // 👈 URL 변경 시 실행

    // 🔹 2️⃣ 검색 API 요청 (위의 상태들이 업데이트된 후 실행)
    useEffect(() => {
        if (!regionSelect && !jobCategorySelect && !searchKeyword) return; // 값이 없으면 요청 안 함

        setLoading(true);
        axios.get("http://localhost:8080/mainPage/searchPosts", {
            params: {
                regionSelect: regionSelect || undefined,
                jobCategorySelect: jobCategorySelect || undefined,
                searchKeyword: searchKeyword || undefined
            }
        })
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [regionSelect, jobCategorySelect, searchKeyword]); // 👈 상태 변경 시 다시 요청

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Job Posts</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}
