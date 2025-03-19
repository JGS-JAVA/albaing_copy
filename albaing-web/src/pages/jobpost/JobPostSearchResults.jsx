import Banner from "../../components/layout/Banner";
import {useState} from "react";

const JobPostSearchResults = () => {
    const searchKeyword = new URLSearchParams(window.location.searchKeyword);
    const regionSelect = new URLSearchParams(window.location.regionSelect);
    const jobCategorySelect = new URLSearchParams(window.location.jobCategorySelect);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/admin/jobs/mainPage/searchPosts", {params: {searchKeyword, regionSelect, jobCategorySelect}})
            .then(response => {
                setSearchResults(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div>
            <Banner/>
            <div>
                <h1>검색 결과</h1>
                {loading ? (
                    <p>로딩 중...</p>
                ) : (
                    <ul>
                        {searchResults.map((item, index) => (
                            <li key={index}>{item.jobPostTitle}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default JobPostSearchResults;

