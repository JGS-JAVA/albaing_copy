import { useEffect, useState } from "react";
import axios from "axios";

export default function DataFetchingPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 요청에 사용할 파라미터 상태
    const [regionSelect, setRegionSelect] = useState("");
    const [jobCategorySelect, setJobCategorySelect] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        axios.get("/mainPage/searchPosts", {
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
    }, [regionSelect, jobCategorySelect, searchKeyword]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Job Posts</h1>
            <div>
                <input type="text" placeholder="Region" value={regionSelect} onChange={(e) => setRegionSelect(e.target.value)} />
                <input type="text" placeholder="Job Category" value={jobCategorySelect} onChange={(e) => setJobCategorySelect(e.target.value)} />
                <input type="text" placeholder="Search Keyword" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
            </div>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
        </div>
    );
}
