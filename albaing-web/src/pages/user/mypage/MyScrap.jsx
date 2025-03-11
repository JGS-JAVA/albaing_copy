import {Link, useParams} from "react-router-dom";
import {useState} from "react";

const MyScrap =()=>{
    const {userId} = useParams();
    const [user, setUser] = useState(null);



    return (
        <div className="flex max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* 사이드바 */}
            <aside className="w-1/4 p-4 border-r border-gray-200">
                <nav>
                    <ul className="space-y-4 text-sm font-semibold text-gray-700">
                        <li>
                            <Link to={`/mypage/${userId}`} className="block p-2 hover:text-blue-600">나의 이력서 관리</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/applications`} className="block p-2 hover:text-blue-600">나의 지원현황</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/scraps`} className="block p-2 hover:text-blue-600">스크랩한 공고</Link>
                        </li>
                        <li>
                            <Link to={`/mypage/reviews`} className="block p-2 hover:text-blue-600">나의 리뷰 관리</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>

            )
            }; export default MyScrap;